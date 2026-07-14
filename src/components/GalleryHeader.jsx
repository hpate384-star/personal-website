'use client';

import { useState } from 'react';
import { useGalleryStore } from '@/store/galleryStore';

export default function GalleryHeader() {
  const { 
    viewMode, 
    setViewMode, 
    searchQuery, 
    setSearchQuery,
    autoRefresh,
    setAutoRefresh,
    currentPath
  } = useGalleryStore();

  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = () => {
    setLastRefresh(new Date());
    // Trigger refresh logic (will be connected to AWS later)
  };

  return (
    <header className="gallery-header">
      <div className="header-left">
        <h1 className="gallery-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13 2 13 9 20 9"/>
          </svg>
          My Gallery
        </h1>
        
        <div className="breadcrumb">
          <span className="breadcrumb-item">Home</span>
          {currentPath !== '/' && (
            <>
              <span className="separator">/</span>
              <span className="breadcrumb-item active">{currentPath}</span>
            </>
          )}
        </div>
      </div>

      <div className="header-center">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search in gallery..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="header-right">
        {/* Auto-refresh toggle */}
        <button 
          className={`icon-btn ${autoRefresh ? 'active' : ''}`}
          onClick={() => setAutoRefresh(!autoRefresh)}
          title="Auto-refresh"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
        </button>

        {/* Manual refresh */}
        <button 
          className="icon-btn"
          onClick={handleRefresh}
          title="Refresh now"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </button>

        {/* View mode toggle */}
        <div className="view-toggle">
          <button 
            className={`icon-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
          <button 
            className={`icon-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Settings */}
        <button className="icon-btn" title="Settings">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m5.66-15.66l-4.24 4.24m0 6l-4.24 4.24M1 12h6m6 0h6m-15.66 5.66l4.24-4.24m6 0l4.24 4.24"/>
          </svg>
        </button>
      </div>

      <style jsx>{`
        .gallery-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: white;
          border-bottom: 1px solid #e0e0e0;
          gap: 24px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 250px;
        }

        .gallery-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 600;
          color: #202124;
          margin: 0;
        }

        .gallery-title svg {
          color: #1a73e8;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #5f6368;
        }

        .breadcrumb-item {
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .breadcrumb-item:hover {
          background: #f1f3f4;
        }

        .breadcrumb-item.active {
          color: #202124;
          font-weight: 500;
        }

        .separator {
          margin: 0 4px;
        }

        .header-center {
          flex: 1;
          max-width: 600px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          background: #f1f3f4;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .search-box:focus-within {
          background: white;
          box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
        }

        .search-box svg {
          color: #5f6368;
          flex-shrink: 0;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 14px;
          outline: none;
          color: #202124;
        }

        .search-box input::placeholder {
          color: #5f6368;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          color: #5f6368;
        }

        .icon-btn:hover {
          background: #f1f3f4;
        }

        .icon-btn.active {
          color: #1a73e8;
          background: #e8f0fe;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: #f1f3f4;
          border-radius: 8px;
        }

        .view-toggle .icon-btn {
          width: 36px;
          height: 36px;
        }

        .view-toggle .icon-btn.active {
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        @media (max-width: 768px) {
          .gallery-header {
            flex-wrap: wrap;
            padding: 12px 16px;
          }

          .header-left {
            min-width: auto;
          }

          .breadcrumb {
            display: none;
          }

          .header-center {
            order: 3;
            width: 100%;
            max-width: none;
            margin-top: 12px;
          }
        }
      `}</style>
    </header>
  );
}
