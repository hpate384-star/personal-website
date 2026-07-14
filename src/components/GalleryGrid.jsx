'use client';

import { useState, useEffect } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { useGalleryStore } from '@/store/galleryStore';
import ImageCard from './ImageCard';

// Mock data - will be replaced with AWS S3 data
const generateMockImages = (count = 100) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `img-${i}`,
    name: `Image ${i + 1}.jpg`,
    thumbnailUrl: `https://picsum.photos/300/300?random=${i}`,
    originalUrl: `https://picsum.photos/2000/2000?random=${i}`,
    size: Math.floor(Math.random() * 5000000) + 500000,
    uploadDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    type: 'image/jpeg',
  }));
};

export default function GalleryGrid({ onImageClick }) {
  const { viewMode, searchQuery, selectedImages, toggleSelection } = useGalleryStore();
  const [images, setImages] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Load mock images (will be replaced with AWS API call)
    setImages(generateMockImages(100));
  }, []);

  useEffect(() => {
    // Update dimensions on resize
    const updateDimensions = () => {
      const container = document.querySelector('.gallery-grid-container');
      if (container) {
        setDimensions({
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Filter images based on search query
  const filteredImages = images.filter(img =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Grid layout calculations
  const columnCount = viewMode === 'grid' ? Math.floor(dimensions.width / 220) || 4 : 1;
  const rowCount = Math.ceil(filteredImages.length / columnCount);
  const itemWidth = viewMode === 'grid' ? 200 : dimensions.width - 40;
  const itemHeight = viewMode === 'grid' ? 200 : 80;

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const image = filteredImages[index];

    if (!image) return null;

    const isSelected = selectedImages.includes(image.id);

    return (
      <div style={style}>
        <ImageCard
          image={image}
          viewMode={viewMode}
          isSelected={isSelected}
          onSelect={() => toggleSelection(image.id)}
          onClick={() => onImageClick(image)}
        />
      </div>
    );
  };

  if (filteredImages.length === 0) {
    return (
      <div className="empty-state">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <h3>No images found</h3>
        <p>
          {searchQuery 
            ? `No results for "${searchQuery}"`
            : 'Upload images to your S3 bucket to get started'
          }
        </p>

        <style jsx>{`
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #5f6368;
          }

          .empty-state svg {
            margin-bottom: 24px;
            opacity: 0.3;
          }

          .empty-state h3 {
            font-size: 22px;
            font-weight: 400;
            color: #202124;
            margin: 0 0 8px 0;
          }

          .empty-state p {
            font-size: 14px;
            color: #5f6368;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="gallery-grid-container">
      {dimensions.width > 0 && (
        <Grid
          columnCount={columnCount}
          columnWidth={itemWidth + 20}
          height={dimensions.height}
          rowCount={rowCount}
          rowHeight={itemHeight + 20}
          width={dimensions.width}
        >
          {Cell}
        </Grid>
      )}

      <div className="stats-bar">
        <span>{filteredImages.length} items</span>
        {selectedImages.length > 0 && (
          <span className="selected-count">
            {selectedImages.length} selected
          </span>
        )}
      </div>

      <style jsx>{`
        .gallery-grid-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .stats-bar {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 8px 16px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          font-size: 13px;
          color: #5f6368;
          z-index: 10;
        }

        .selected-count {
          color: #1a73e8;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
