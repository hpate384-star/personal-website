"use client";
import React, { useEffect, useState } from 'react';
import { useZIndex } from '../hooks/useZIndex';

const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks?limit=4&time_range=short_term';
const TOKEN_ENDPOINT = '/api/spotify/token';


const getDominantColor = async (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 50, 50);
        
        const imageData = ctx.getImageData(0, 0, 50, 50).data;
        
        
        const colorMap = {};
        
        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          
          
          const brightness = (r + g + b) / 3;
          if (brightness < 30 || brightness > 230) continue;
          
          
          const rKey = Math.round(r / 10) * 10;
          const gKey = Math.round(g / 10) * 10;
          const bKey = Math.round(b / 10) * 10;
          const key = `${rKey},${gKey},${bKey}`;
          
          
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          
          if (!colorMap[key]) {
            colorMap[key] = { count: 0, r: rKey, g: gKey, b: bKey, saturation };
          }
          colorMap[key].count++;
        }
        
        
        let dominantColor = null;
        let maxScore = 0;
        
        for (const key in colorMap) {
          const color = colorMap[key];
          
          const score = color.count * (1 + color.saturation * 3);
          if (score > maxScore) {
            maxScore = score;
            dominantColor = color;
          }
        }
        
        if (dominantColor) {
          const { r, g, b } = dominantColor;
          
          
          const lr = Math.floor(r + (255 - r) * 0.65);
          const lg = Math.floor(g + (255 - g) * 0.65);
          const lb = Math.floor(b + (255 - b) * 0.65);
          
          
          const dr = Math.floor(lr * 0.96);
          const dg = Math.floor(lg * 0.96);
          const db = Math.floor(lb * 0.96);
          
          const lighter = `rgb(${lr}, ${lg}, ${lb})`;
          const darker = `rgb(${dr}, ${dg}, ${db})`;
          
          
          const lum = 0.299 * lr + 0.587 * lg + 0.114 * lb;
          const isLight = lum > 150;
          const textColor = isLight ? '#1c1c1e' : '#fff';
          const secondaryTextColor = isLight ? 'rgba(0, 0, 0, 0.65)' : 'rgba(255, 255, 255, 0.8)';
          
          resolve({ lighter, darker, textColor, secondaryTextColor });
        } else {
          resolve({ lighter: '#4b755b', darker: '#121212', textColor: '#fff', secondaryTextColor: 'rgba(255,255,255,0.7)' });
        }
      } catch (e) {
        console.error('Color extraction error:', e);
        resolve({ lighter: '#4b755b', darker: '#121212', textColor: '#fff', secondaryTextColor: 'rgba(255,255,255,0.7)' });
      }
    };
    img.onerror = () => resolve({ lighter: '#4b755b', darker: '#121212', textColor: '#fff', secondaryTextColor: 'rgba(255,255,255,0.7)' });
    img.src = imageUrl;
  });
};

const getAccessToken = async () => {
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (data.error) {
      
      return null;
    }
    return data.access_token;
  } catch (error) {
    
    return null;
  }
};

const getNowPlaying = async () => {
  try {
    const access_token = await getAccessToken();
    if (!access_token) throw new Error('No access token');

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (response.status === 204) {
      return null;
    }

    if (response.status > 400) {
      throw new Error('Unable to Fetch Song');
    }

    const song = await response.json();
    
    return {
      albumImageUrl: song.item?.album?.images?.[0]?.url || '',
      artist: song.item?.artists?.map((artist) => artist.name).join(', ') || '',
      isPlaying: song.is_playing || false,
      songUrl: song.item?.external_urls?.spotify || '',
      title: song.item?.name || '',
    };
  } catch (error) {
    
    return null;
  }
};

const getTopTracks = async () => {
  try {
    const access_token = await getAccessToken();
    if (!access_token) throw new Error('No access token');

    const response = await fetch(TOP_TRACKS_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (response.status > 400) {
      throw new Error('Unable to Fetch Top Tracks');
    }

    const data = await response.json();
    
    return data.items?.slice(0, 4).map(track => ({
      name: track.name,
      cover: track.album?.images?.[0]?.url || '',
      url: track.external_urls?.spotify || '',
    })) || [];
  } catch (error) {
    
    return [];
  }
};

export default function SpotifyNowPlayingWidget() {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [colors, setColors] = useState({ lighter: '#4b755b', darker: '#2a4233', textColor: '#fff', secondaryTextColor: 'rgba(255,255,255,0.8)' });
  const [zIndex, bringToFront] = useZIndex(5);

  
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('spotify_last_played');
    const savedTracks = localStorage.getItem('spotify_top_tracks');
    const savedColors = localStorage.getItem('spotify_colors');
    
    if (saved) {
      try {
        setNowPlaying(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing saved song:', e);
      }
    }
    
    if (savedTracks) {
      try {
        setTopTracks(JSON.parse(savedTracks));
      } catch (e) {
        console.error('Error parsing saved tracks:', e);
      }
    }

    if (savedColors) {
      try {
        setColors(JSON.parse(savedColors));
      } catch (e) {
        console.error('Error parsing saved colors:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchNowPlaying = async () => {
      try {
        const data = await getNowPlaying();
        if (data) {
          setNowPlaying(data);
          localStorage.setItem('spotify_last_played', JSON.stringify(data));
          
          
          if (data.albumImageUrl) {
            const newColors = await getDominantColor(data.albumImageUrl);
            setColors(newColors);
            localStorage.setItem('spotify_colors', JSON.stringify(newColors));
          }
        }
      } catch (error) {
        console.error('Error in fetchNowPlaying:', error);
      }
    };

    const fetchTopTracks = async () => {
      try {
        const tracks = await getTopTracks();
        if (tracks && tracks.length > 0) {
          setTopTracks(tracks);
          localStorage.setItem('spotify_top_tracks', JSON.stringify(tracks));
        }
      } catch (error) {
        console.error('Error in fetchTopTracks:', error);
      }
    };

    fetchNowPlaying();
    fetchTopTracks();
    
    const interval = setInterval(fetchNowPlaying, 5000);
    return () => clearInterval(interval);
  }, [mounted]);

  const title = nowPlaying?.title || 'Not Playing';
  const artist = nowPlaying?.artist || 'Open Spotify to see what\'s playing';
  const albumImageUrl = nowPlaying?.albumImageUrl || '';
  const songUrl = nowPlaying?.songUrl || '';

  
  const favoriteSongs = topTracks.length > 0 ? topTracks : [
    { name: 'Song 1', cover: null, color: '#FF6B9D' },
    { name: 'Song 2', cover: null, color: '#4ECDC4' },
    { name: 'Song 3', cover: null, color: '#FFE66D' },
    { name: 'Song 4', cover: null, color: '#95E1D3' },
  ];

  return (
    <div
      onMouseDown={bringToFront}
      style={{
        position: 'fixed',
        left: '32px',
        top: '224px',
        width: '327px',
        zIndex: zIndex,
        opacity: 1,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: '24px',
          border: `1px solid ${colors.textColor === '#fff' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`,
          boxSizing: 'border-box',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          userSelect: 'none',
          color: colors.textColor,
          cursor: 'grab',
        }}
      >
        {}
        <div
          style={{
            background: colors.lighter,
            padding: '14px 16px 12px',
            cursor: songUrl ? 'pointer' : 'default',
            pointerEvents: 'auto',
          }}
          onClick={(e) => {
            e.stopPropagation()
            if (songUrl) window.open(songUrl, '_blank')
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
          {}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              pointerEvents: 'none',
            }}
          >
            {albumImageUrl ? (
              <img
                src={albumImageUrl}
                alt={title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div style={{ fontSize: '24px' }}>🎵</div>
            )}
          </div>

          {}
          <div style={{ flex: 1, minWidth: 0, pointerEvents: 'none' }}>
            <div
              style={{
                fontSize: '15px',
                fontWeight: '700',
                color: colors.textColor,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: '2px',
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: '500',
                color: colors.secondaryTextColor,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {artist}
            </div>
          </div>

          {}
          <svg width="24" height="24" viewBox="0 0 24 24" fill={colors.textColor} style={{ flexShrink: 0, pointerEvents: 'none', opacity: 0.9 }}>
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </div>
        </div>

        {}
        <div style={{ background: colors.darker, padding: '12px 16px 16px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
            }}
          >
            {favoriteSongs.map((song, index) => (
              <div
                key={index}
                style={{
                  width: '100%',
                  paddingBottom: '100%', 
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: song.color || 'rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                }}
                onClick={() => {
                  if (song.url) window.open(song.url, '_blank');
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
              >
                {song.cover && (
                  <img
                    src={song.cover}
                    alt={song.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
