import React, { useState, useRef, useEffect, useMemo, useContext } from 'react';
import { Map, Overlay } from 'pigeon-maps';
import useSupercluster from 'use-supercluster';
import { PHOTO_LOCATIONS } from '../../data/locations';
import { WindowCtx } from '../Window';

// Function to provide Carto Voyager tiles (visually matches Apple Maps colors)
function mapTiler(x, y, z, dpr) {
  const s = ['a', 'b', 'c', 'd'][Math.abs(x + y) % 4];
  return `https://${s}.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png`;
}

// Compute bounding box synchronously — must always be in sync with center/zoom
function computeBounds(center, zoom, width, height) {
  const scale = Math.pow(2, zoom);
  const lngW = 360 / scale * (width / 256);
  const latW = 170 / scale * (height / 256);
  const west = lngW >= 360 ? -180 : Math.max(-180, center[1] - lngW / 2);
  const east = lngW >= 360 ? 180 : Math.min(180, center[1] + lngW / 2);
  const south = Math.max(-85, center[0] - latW / 2);
  const north = Math.min(85, center[0] + latW / 2);
  return [west, south, east, north];
}

export default function PhotosMap({ images }) {
  const windowCtx = useContext(WindowCtx);
  const { openWindow } = windowCtx || {};

  const [zoom, setZoom] = useState(2);
  const [center, setCenter] = useState([30, 10]);

  // Measure container dimensions
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Set initial dimensions immediately
    setDimensions({ width: el.clientWidth, height: el.clientHeight });
    const obs = new ResizeObserver((entries) => {
      if (entries[0]) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height,
        });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // KEY FIX: compute bounds INLINE during render — never stale, always in sync
  const bounds = useMemo(
    () => computeBounds(center, zoom, dimensions.width, dimensions.height),
    [center, zoom, dimensions]
  );

  // Format data for supercluster
  const points = useMemo(() => {
    return images
      .filter(img => PHOTO_LOCATIONS[img])
      .map(img => {
        const loc = PHOTO_LOCATIONS[img];
        return {
          type: 'Feature',
          properties: { cluster: false, img },
          geometry: { type: 'Point', coordinates: [loc.lng, loc.lat] },
        };
      });
  }, [images]);

  // Clusters are now computed with always-current bounds
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  const handleImageDoubleClick = (img) => {
    const previewId = `Preview_custom_photo_${img}`;
    sessionStorage.setItem(previewId, `/gallery/${img}`);
    if (openWindow) openWindow(previewId);
  };

  const handleClusterClick = (cluster) => {
    const [longitude, latitude] = cluster.geometry.coordinates;
    const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
    setCenter([latitude, longitude]);
    setZoom(expansionZoom);
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#d5e2ed' }}>
      <Map
        provider={mapTiler}
        center={center}
        zoom={zoom}
        onBoundsChanged={({ center, zoom }) => {
          setCenter(center);
          setZoom(zoom);
        }}
        minZoom={3}
        maxZoom={18}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } = cluster.properties;

          if (isCluster) {
            const leaves = supercluster.getLeaves(cluster.id, 1);
            const coverImg = leaves[0]?.properties.img;

            return (
              <Overlay key={`cluster-${cluster.id}`} anchor={[latitude, longitude]} offset={[32, 70]}>
                <div
                  onClick={() => handleClusterClick(cluster)}
                  style={{
                    position: 'relative',
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    padding: '3px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {/* Tail */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '8px solid #fff',
                    filter: 'drop-shadow(0 4px 2px rgba(0,0,0,0.1))',
                  }} />

                  <img
                    src={`/gallery/${coverImg}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                    alt="Cluster cover"
                  />

                  {/* Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '-4px',
                    backgroundColor: '#ff3b30',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 2,
                  }}>
                    {pointCount}
                  </div>
                </div>
              </Overlay>
            );
          }

          // Individual photo pin
          const img = cluster.properties.img;
          return (
            <Overlay key={`photo-${img}`} anchor={[latitude, longitude]} offset={[32, 70]}>
              <div
                onClick={() => handleImageDoubleClick(img)}
                style={{
                  position: 'relative',
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  padding: '3px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {/* Tail */}
                <div style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid #fff',
                  filter: 'drop-shadow(0 4px 2px rgba(0,0,0,0.1))',
                }} />

                <img
                  src={`/gallery/${img}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                  alt="Map pin"
                />
              </div>
            </Overlay>
          );
        })}
      </Map>
    </div>
  );
}
