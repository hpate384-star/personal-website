# Draggable Items Features

This document describes the new draggable item features implemented in the portfolio website.

## 🎯 Features Implemented

### 1. **Persist Drag Positions to Supabase**
All item positions (both Finder window items and desktop icons) are now persisted to Supabase and restored on page reload.

#### Database Tables:
- `item_positions` - Stores positions for items inside Finder windows
- `desktop_positions` - Stores positions for desktop icons

#### How it works:
- Positions are saved automatically when you drag and drop an item
- On page load, positions are fetched from Supabase
- Uses session ID stored in localStorage to track individual user sessions

### 2. **Multi-Select & Batch Dragging**
You can now select and drag multiple items at once!

#### How to use:
- **Single Select**: Click on an item
- **Multi-Select**: Hold `Cmd` (Mac) or `Ctrl` (Windows/Linux) while clicking items
- **Batch Drag**: Select multiple items, then drag any selected item - all selected items move together
- **Deselect**: Click on empty space to clear selection

#### Where it works:
- ✅ Finder window (About Me section)
- ✅ Desktop icons

### 3. **Snap-to-Grid**
Items automatically snap to an invisible grid when dragged, keeping everything aligned and organized.

#### Grid Settings:
- **Finder Window**: 110px grid (aligns with initial layout)
- **Desktop Icons**: 20px grid (finer control)

#### Benefits:
- Items stay aligned and organized
- Matches macOS Finder behavior
- Creates a cleaner, more professional appearance

## 🔧 Setup Instructions

### 1. Run the Supabase Schema
Execute the SQL schema to create the necessary tables:

```bash
# Open your Supabase project
# Go to SQL Editor
# Copy and paste the contents of supabase-schema.sql
# Click "Run"
```

Or use the Supabase CLI:
```bash
supabase db push
```

### 2. Verify Tables
After running the schema, verify these tables exist:
- `item_positions`
- `desktop_positions`

## 🎨 Component API

### DraggableItem Component

```jsx
<DraggableItem
  id="unique-id"
  x={100}
  y={100}
  label="Item Name"
  img={iconImage}
  selected={isSelected}
  onClick={(id, event) => handleClick(id)}
  onDoubleClick={(id, event) => handleDoubleClick(id)}
  onDragEnd={(id, x, y) => savePosition(id, x, y)}
  onBatchDragEnd={(deltaX, deltaY) => moveBatch(deltaX, deltaY)}
  containerRef={containerRef}
  gridSize={110}              // Grid snapping size (0 = disabled)
  enableMultiSelect={true}    // Enable multi-select behavior
  // Styling props
  textColor="#1c1c1e"
  selectedBg="rgba(0, 100, 255, 0.15)"
  selectedTextColor="#fff"
  selectedTextBg="#0064ff"
  iconWidth={52}
  iconHeight={52}
  itemWidth={80}
  textShadow={false}
/>
```

### Key Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gridSize` | number | 0 | Grid snapping size in pixels (0 disables) |
| `enableMultiSelect` | boolean | false | Enable multi-select with Cmd/Ctrl |
| `onBatchDragEnd` | function | - | Called when dragging multiple items |
| `containerRef` | ref | - | Ref for boundary checking |

## 📝 Usage Examples

### Example 1: Finder Window Items
```jsx
const [itemPositions, setItemPositions] = useState({})
const [selected, setSelected] = useState([])

<DraggableItem
  id="folder-1"
  x={itemPositions['folder-1'].x}
  y={itemPositions['folder-1'].y}
  label="My Folder"
  img={folderImg}
  selected={selected.includes('folder-1')}
  gridSize={110}
  enableMultiSelect={true}
  onDragEnd={handleDragEnd}
  onBatchDragEnd={handleBatchDragEnd}
/>
```

### Example 2: Desktop Icons
```jsx
<DraggableItem
  id="documents"
  x={1000}
  y={100}
  label="Documents"
  img={folderImg}
  selected={selected.includes('documents')}
  gridSize={20}
  enableMultiSelect={true}
  textColor="#fff"
  textShadow={true}
/>
```

## 🐛 Troubleshooting

### Items aren't persisting
1. Check that Supabase tables are created correctly
2. Verify Supabase credentials in `src/lib/supabase.js`
3. Check browser console for Supabase errors

### Multi-select not working
1. Ensure `enableMultiSelect={true}` is set
2. Try holding Cmd (Mac) or Ctrl (Windows/Linux) while clicking
3. Make sure `selected` is an array, not a single value

### Grid snapping not working
1. Verify `gridSize` prop is set (e.g., `gridSize={110}`)
2. Check that the value is greater than 0

## 🚀 Future Enhancements

Potential improvements that could be added:
- Keyboard navigation (arrow keys)
- Context menu (right-click)
- Auto-arrange options
- Collision detection
- Touch/mobile support
- Undo/redo functionality

## 📚 Technical Details

### Batch Dragging Algorithm
1. When drag starts, check if item is selected
2. If selected and multi-select enabled, use batch mode
3. Calculate delta (difference) from initial to final position
4. Apply same delta to all selected items
5. Save all positions to Supabase

### Grid Snapping Algorithm
```javascript
const snapToGrid = (value) => {
  if (gridSize <= 0) return value
  return Math.round(value / gridSize) * gridSize
}
```

### Multi-Select State Management
```javascript
// Click handler
const isMultiSelectKey = e.metaKey || e.ctrlKey

if (isMultiSelectKey) {
  // Toggle item in selection
  setSelected(prev => 
    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
  )
} else {
  // Replace selection
  setSelected([id])
}
```
