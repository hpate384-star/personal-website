import React, { useContext, useState } from 'react';
import { WindowCtx } from '../Window';
import Image from 'next/image';
import PhotosMap from './PhotosMap';

const SidebarItem = ({ icon, label, selected, onClick }) => (
  <div 
    onClick={onClick}
    style={{
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
    borderRadius: '6px',
    margin: '2px 10px',
    backgroundColor: selected ? '#e5e5ea' : 'transparent',
    cursor: 'pointer',
    color: '#1d1d1f',
    fontSize: '13.5px',
    fontWeight: selected ? '500' : '400',
    transition: 'background 0.1s',
  }}>
    <div style={{ color: '#0066cc', marginRight: '10px', display: 'flex', opacity: selected ? 1 : 0.8 }}>
      {icon}
    </div>
    {label}
  </div>
);

const LibraryIcon = () => (
  <svg viewBox="0 0 62.5 50.1758" width="16" height="16" fill="currentColor">
    <path d="M50 7.51953L50 11.2305L46.543 11.2305L46.543 7.71484C46.543 4.90234 45 3.45703 42.3242 3.45703L7.67578 3.45703C4.94141 3.45703 3.45703 4.90234 3.45703 7.71484L3.45703 31.2305C3.45703 34.043 4.94141 35.4883 7.67578 35.4883L12.1289 35.4883L12.1289 38.9453L7.59766 38.9453C2.53906 38.9453 0 36.4258 0 31.4258L0 7.51953C0 2.53906 2.53906 0 7.59766 0L42.4023 0C47.4219 0 50 2.55859 50 7.51953Z" />
    <path d="M30.0195 30.4102C32.9688 30.4102 35.3711 27.9688 35.3711 25C35.3711 22.0898 32.9688 19.6289 30.0195 19.6289C27.0508 19.6289 24.668 22.0898 24.668 25C24.668 27.9688 27.0508 30.4102 30.0195 30.4102ZM19.7656 48.9648L54.0625 48.9648C58.3008 48.9648 60.5078 46.8164 60.5078 42.5781L60.5078 40.8203L48.9062 29.9219C47.8906 28.9844 46.6797 28.4961 45.4102 28.4961C44.1211 28.4961 43.0273 28.9453 41.9336 29.9023L31.7188 38.8867L27.7148 35.2344C26.7383 34.3555 25.7422 33.9258 24.6094 33.9258C23.5938 33.9258 22.6758 34.3555 21.6992 35.2148L13.3008 42.5977C13.3008 46.8164 15.5273 48.9648 19.7656 48.9648ZM19.7266 50.1758L54.5117 50.1758C59.5508 50.1758 62.1289 47.6172 62.1289 42.6562L62.1289 18.75C62.1289 13.7891 59.5508 11.2305 54.5117 11.2305L19.7266 11.2305C14.668 11.2305 12.1289 13.7695 12.1289 18.75L12.1289 42.6562C12.1289 47.6562 14.668 50.1758 19.7266 50.1758ZM19.7852 46.7188C17.0703 46.7188 15.5859 45.2734 15.5859 42.4805L15.5859 18.9453C15.5859 16.1328 17.0703 14.6875 19.7852 14.6875L54.4531 14.6875C57.1289 14.6875 58.6523 16.1328 58.6523 18.9453L58.6523 42.4805C58.6523 45.2734 57.1289 46.7188 54.4531 46.7188Z" />
  </svg>
)

const MapIcon = () => (
  <svg viewBox="0 0 51.7188 49.1992" width="16" height="16" fill="currentColor">
    <path d="M2.55859 48.1836C3.14453 48.1836 3.73047 47.9688 4.47266 47.5586L17.3633 40.5273L31.1914 48.4375C32.0703 48.9453 32.9883 49.1992 33.8672 49.1992C34.707 49.1992 35.5273 48.9648 36.2891 48.5156L49.375 41.0156C50.7422 40.2539 51.3477 39.1992 51.3477 37.6367L51.3477 3.71094C51.3477 2.01172 50.4102 1.03516 48.7891 1.03516C48.2031 1.03516 47.6172 1.25 46.875 1.64062L33.5547 9.02344L20 0.722656C19.1992 0.253906 18.3398 0.0195312 17.4609 0.0195312C16.582 0.0195312 15.6836 0.253906 14.8828 0.722656L1.97266 8.20312C0.605469 8.98438 0 10.0195 0 11.6016L0 45.4883C0 47.207 0.9375 48.1836 2.55859 48.1836ZM15.9766 37.1484L4.19922 43.6523C4.08203 43.7109 3.94531 43.7695 3.82812 43.7695C3.61328 43.7695 3.45703 43.5938 3.45703 43.3203L3.45703 12.4219C3.45703 11.8164 3.67188 11.3867 4.27734 11.0352L15.0977 4.64844C15.3906 4.47266 15.6641 4.33594 15.9766 4.17969ZM19.4336 37.4805L19.4336 4.60938C19.6875 4.72656 19.9805 4.88281 20.2148 5.01953L31.9141 12.168L31.9141 44.6094C31.582 44.4531 31.2305 44.2773 30.8984 44.082ZM35.3906 44.9805L35.3906 11.9727L47.1484 5.56641C47.2852 5.48828 47.4023 5.44922 47.5195 5.44922C47.7539 5.44922 47.8906 5.60547 47.8906 5.87891L47.8906 36.7969C47.8906 37.4023 47.6758 37.8516 47.0898 38.2031L36.4453 44.4141C36.0938 44.6289 35.7422 44.8047 35.3906 44.9805Z" />
  </svg>
)

const TripsIcon = () => (
  <svg viewBox="0 0 57.9492 48.3398" width="16" height="16" fill="currentColor">
    <path d="M10.5859 10.4297L10.5859 46.1914L14.043 46.1914L14.043 10.4297ZM43.5352 10.4297L43.5352 46.1914L46.9922 46.1914L46.9922 10.4297ZM7.40234 48.3203L50.1758 48.3203C55.1367 48.3203 57.5781 45.918 57.5781 41.0156L57.5781 16.2695C57.5781 11.3477 55.1367 8.94531 50.1758 8.94531L7.40234 8.94531C2.46094 8.94531 0 11.3477 0 16.2695L0 41.0156C0 45.918 2.46094 48.3203 7.40234 48.3203ZM7.44141 44.8828C4.80469 44.8828 3.45703 43.5742 3.45703 40.8594L3.45703 16.4258C3.45703 13.6914 4.80469 12.3828 7.44141 12.3828L50.1367 12.3828C52.793 12.3828 54.1211 13.6914 54.1211 16.4258L54.1211 40.8594C54.1211 43.5742 52.793 44.8828 50.1367 44.8828ZM16.25 10.8594L19.5898 10.8594L19.5898 6.21094C19.5898 4.27734 20.7617 3.16406 22.793 3.16406L34.7656 3.16406C36.8164 3.16406 37.9883 4.27734 37.9883 6.21094L37.9883 10.8203L41.3281 10.8203L41.3281 6.44531C41.3281 2.10938 38.9648 0 34.707 0L22.8711 0C18.8086 0 16.25 2.10938 16.25 6.44531Z" />
  </svg>
)

const GALLERY_IMAGES = [
  '6E979A24-4273-4D85-8CE9-AA678082A688.JPG',
  'IMG_0228.JPG',
  'IMG_0302.jpg',
  'IMG_0376.jpg',
  'IMG_0408.jpg',
  'IMG_0813.jpg',
  'IMG_0852.jpg',
  'IMG_1040.jpg',
  'IMG_1057.JPG',
  'IMG_1126.JPG',
  'IMG_1260.jpg',
  'IMG_1311.jpg',
  'IMG_1448.JPG',
  'IMG_1456.jpg',
  'IMG_1527.JPG',
  'IMG_1555.JPG',
  'IMG_1623.JPG',
  'IMG_1657.JPG',
  'IMG_1786.jpg',
  'IMG_1808.jpg',
  'IMG_1830.JPG',
  'IMG_3729.jpg',
  'IMG_4103.jpg',
  'IMG_4783.jpg',
  'IMG_6505.JPG',
  'IMG_6576.JPG',
  'IMG_7396.jpg',
  'IMG_7503.JPG',
  'IMG_7559.JPG',
  'IMG_7700.jpg',
  'dji_fly_20250722_141504_169_1753911275410_photo_optimized.JPG',
  'dji_fly_20250726_195126_214_1753910324590_photo_optimized.JPG'
];

function GalleryGrid({ images, onImageDoubleClick }) {
  const GAP = 2;

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: '#ffffff',
        padding: GAP,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: GAP,
        }}
      >
        {images.map((img) => (
          <div
            key={img}
            onDoubleClick={() => onImageDoubleClick && onImageDoubleClick(img)}
            style={{
              aspectRatio: '1',
              backgroundColor: '#f0f0f5',
              overflow: 'hidden',
              position: 'relative', // required for Next.js Image fill
              minWidth: 0,
            }}
          >
            <GalleryImage src={`/gallery/${img}`} alt={img} />
          </div>
        ))}
      </div>
    </div>
  );
}

// A dedicated component to handle the image loading state (Skeleton -> Image)
function GalleryImage({ src, alt }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <span style={{ color: '#8e8e93', fontSize: '12px' }}>{alt}</span>
      </div>
    );
  }

  return (
    <>
      {/* Skeleton / Placeholder (Visible while loading) */}
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: '#e5e5ea',
            animation: 'pulse 1.5s infinite ease-in-out'
          }}
        />
      )}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>

      {/* Optimized Next.js Image */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 600px) 33vw, (max-width: 900px) 20vw, 15vw"
        style={{
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out',
        }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </>
  );
}

export function PhotosContent() {
  const windowCtx = useContext(WindowCtx);
  const { onTitleBarMouseDown, openWindow } = windowCtx || {};
  const [activeTab, setActiveTab] = useState('Library');
  const [mapEverOpened, setMapEverOpened] = useState(false);

  const handleImageDoubleClick = (img) => {
    const previewId = `Preview_custom_photo_${img}`;
    sessionStorage.setItem(previewId, `/gallery/${img}`);
    if (openWindow) {
      openWindow(previewId);
    }
  };

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: '#1d1d1f'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '200px',
        minWidth: '200px',
        backgroundColor: 'rgba(240, 240, 245, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div
          onMouseDown={onTitleBarMouseDown}
          style={{ height: '52px', paddingLeft: '16px', display: 'flex', alignItems: 'center' }}
        >
          {/* Traffic lights were removed to prevent repeating */}
        </div>

        <div style={{ padding: '4px 0' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#8e8e93', padding: '4px 20px 6px', letterSpacing: '0.2px' }}>
            Photos
          </div>
          <SidebarItem icon={<LibraryIcon />} label="Library" selected={activeTab === 'Library'} onClick={() => setActiveTab('Library')} />
          <SidebarItem icon={<MapIcon />} label="Map" selected={activeTab === 'Map'} onClick={() => { setActiveTab('Map'); setMapEverOpened(true); }} />

          <div style={{ fontSize: '11px', fontWeight: '600', color: '#8e8e93', padding: '16px 20px 6px', letterSpacing: '0.2px' }}>
            Collections
          </div>
          <SidebarItem icon={<TripsIcon />} label="Trips" selected={activeTab === 'Trips'} onClick={() => setActiveTab('Trips')} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Top Bar */}
        <div
          onMouseDown={onTitleBarMouseDown}
          style={{
            height: '52px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ flex: 1 }}></div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#efefef',
            borderRadius: '6px',
            padding: '2px',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
          }}>
            {['Years', 'Months', 'All Photos'].map((item, idx) => (
              <React.Fragment key={item}>
                {idx > 0 && item !== 'All Photos' && (
                  <div style={{ width: '1px', height: '12px', backgroundColor: '#d1d1d6', margin: '0 2px' }} />
                )}
                {idx > 0 && item === 'All Photos' && (
                  <div style={{ width: '1px', height: '12px', backgroundColor: 'transparent', margin: '0 2px' }} />
                )}
                <div style={{
                  padding: '4px 16px',
                  fontSize: '12.5px',
                  fontWeight: item === 'All Photos' ? '500' : '400',
                  backgroundColor: item === 'All Photos' ? '#ffffff' : 'transparent',
                  boxShadow: item === 'All Photos' ? '0 1px 2px rgba(0,0,0,0.08), 0 0.5px 0.5px rgba(0,0,0,0.05)' : 'none',
                  borderRadius: '5px',
                  color: item === 'All Photos' ? '#1d1d1f' : '#8e8e93',
                  cursor: 'pointer'
                }}>
                  {item}
                </div>
              </React.Fragment>
            ))}
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f5f5f7',
              borderRadius: '6px',
              padding: '4px 10px',
              width: '180px',
              border: '1px solid rgba(0,0,0,0.03)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search"
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '13px',
                  color: '#1d1d1f',
                  width: '100%',
                  padding: 0
                }}
              />
            </div>
          </div>
        </div>

        {/* Content Area with transition */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            opacity: activeTab === 'Library' ? 1 : 0,
            pointerEvents: activeTab === 'Library' ? 'auto' : 'none',
            transition: 'opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <GalleryGrid images={GALLERY_IMAGES} onImageDoubleClick={handleImageDoubleClick} />
          </div>

          {mapEverOpened && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              opacity: activeTab === 'Map' ? 1 : 0,
              pointerEvents: activeTab === 'Map' ? 'auto' : 'none',
              transition: 'opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
            }}>
              <PhotosMap images={GALLERY_IMAGES} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
