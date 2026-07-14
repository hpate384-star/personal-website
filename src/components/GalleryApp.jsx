'use client';

import { useState } from 'react';
import GalleryGrid from './GalleryGrid';
import GalleryHeader from './GalleryHeader';
import ImageLightbox from './ImageLightbox';
import { useGalleryStore } from '@/store/galleryStore';

export default function GalleryApp() {
  const [selectedImage, setSelectedImage] = useState(null);
  const { viewMode, searchQuery } = useGalleryStore();

  return (
    <div className="gallery-app">
      <GalleryHeader />
      
      <div className="gallery-container">
        <GalleryGrid 
          onImageClick={setSelectedImage}
        />
      </div>

      {selectedImage && (
        <ImageLightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      <style jsx>{`
        .gallery-app {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8f9fa;
          overflow: hidden;
        }

        .gallery-container {
          flex: 1;
          overflow: hidden;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}
