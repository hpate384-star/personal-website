import { create } from 'zustand';

export const useGalleryStore = create((set) => ({
  // View state
  viewMode: 'grid', // 'grid' or 'list'
  setViewMode: (mode) => set({ viewMode: mode }),

  // Search and filter
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Sorting
  sortBy: 'name', // 'name', 'date', 'size'
  sortOrder: 'asc', // 'asc' or 'desc'
  setSorting: (by, order) => set({ sortBy: by, sortOrder: order }),

  // Selection
  selectedImages: [],
  toggleSelection: (imageId) => set((state) => {
    const isSelected = state.selectedImages.includes(imageId);
    return {
      selectedImages: isSelected
        ? state.selectedImages.filter(id => id !== imageId)
        : [...state.selectedImages, imageId]
    };
  }),
  clearSelection: () => set({ selectedImages: [] }),

  // Auto-refresh
  autoRefresh: true,
  setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),

  // Loading state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Current folder path
  currentPath: '/',
  setCurrentPath: (path) => set({ currentPath: path }),
}));
