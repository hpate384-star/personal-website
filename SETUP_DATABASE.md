# Database Setup Guide

## Quick Setup (5 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project: https://yyfjuhardyoutgzxqbyj.supabase.co
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Schema
1. Open the file `supabase-schema.sql` in this project
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)

### Step 3: Verify Tables Were Created
1. Click on **Table Editor** in the left sidebar
2. You should see two new tables:
   - `item_positions`
   - `desktop_positions`

### Step 4: Test It Out
1. Reload your portfolio website
2. Drag some items around (desktop icons or Finder items)
3. Refresh the page
4. ✅ Items should stay in the same position!

## What Gets Created

### Tables

#### `item_positions`
Stores positions for items inside Finder windows (folders, files, etc.)

| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| session_id | text | User's session identifier |
| item_id | text | Unique item identifier |
| x | integer | X coordinate |
| y | integer | Y coordinate |
| created_at | timestamp | When created |
| updated_at | timestamp | Last updated |

#### `desktop_positions`
Stores positions for desktop icons

| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| session_id | text | User's session identifier |
| item_id | text | Unique item identifier (e.g., 'documents') |
| x | integer | X coordinate |
| y | integer | Y coordinate |
| created_at | timestamp | When created |
| updated_at | timestamp | Last updated |

### Indexes
- Fast lookups by `session_id`
- Prevents duplicate entries with `UNIQUE(session_id, item_id)`

### Security
- Row Level Security (RLS) enabled
- Public access policies (uses session_id instead of user auth)

## Troubleshooting

### Error: "relation already exists"
This means the tables are already created. You can safely ignore this error or drop the tables first:
```sql
DROP TABLE IF EXISTS item_positions CASCADE;
DROP TABLE IF EXISTS desktop_positions CASCADE;
-- Then run the schema again
```

### Error: "permission denied"
Make sure you're logged in to Supabase and have admin access to your project.

### Items aren't saving
1. Check browser console for errors
2. Verify your Supabase credentials in `src/lib/supabase.js`
3. Make sure tables were created successfully

### Check if data is saving
Run this query in SQL Editor:
```sql
-- See all saved positions
SELECT * FROM item_positions;
SELECT * FROM desktop_positions;
```

## Testing Multi-Select

After setup, try these:
1. **Single select**: Click any item
2. **Multi-select**: Hold `Cmd` (Mac) or `Ctrl` (Windows), click multiple items
3. **Batch drag**: Drag one of the selected items - they all move together!
4. **Snap to grid**: Items automatically align to the grid while dragging
5. **Persistence**: Refresh the page - everything stays in place!

## Need Help?

Check the browser console (F12) for error messages. Most issues are related to:
- Supabase connection (check credentials)
- Tables not created (run schema again)
- CORS issues (check Supabase project settings)
