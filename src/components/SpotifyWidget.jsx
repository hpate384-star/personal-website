"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const TOKEN_ENDPOINT = '/api/spotify/token';
const REFRESH_TOKEN = process.env.NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN;


const getAccessToken = async () => {
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: REFRESH_TOKEN,
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error('Token error:', data.error);
      return null;
    }
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
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
      throw new Error('Currently Not Playing');
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
      timePlayed: song.progress_ms || 0,
      timeTotal: song.item?.duration_ms || 0,
    };
  } catch (error) {
    console.error('Error fetching currently playing song:', error);
    return null;
  }
};

export default function SpotifyWidget() {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      setLoading(true);
      const data = await getNowPlaying();
      setNowPlaying(data);
      setLoading(false);
    };

    fetchNowPlaying();
    
    
    const interval = setInterval(fetchNowPlaying, 5000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => (n < 10 ? '0' + n : n);

  let playerState = 'OFFLINE';
  let title = 'Not Playing';
  let artist = 'Spotify';
  let albumImageUrl = '';
  let minutesPlayed = 0;
  let secondsPlayed = 0;
  let minutesTotal = 0;
  let secondsTotal = 0;
  let songUrl = '';

  if (nowPlaying && nowPlaying.title) {
    playerState = nowPlaying.isPlaying ? 'PLAY' : 'PAUSE';
    title = nowPlaying.title;
    artist = nowPlaying.artist;
    albumImageUrl = nowPlaying.albumImageUrl;
    songUrl = nowPlaying.songUrl;

    secondsPlayed = Math.floor(nowPlaying.timePlayed / 1000);
    minutesPlayed = Math.floor(secondsPlayed / 60);
    secondsPlayed = secondsPlayed % 60;

    secondsTotal = Math.floor(nowPlaying.timeTotal / 1000);
    minutesTotal = Math.floor(secondsTotal / 60);
    secondsTotal = secondsTotal % 60;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        maxWidth: '320px',
        boxShadow: '0 8px 24px rgba(29, 185, 84, 0.3)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(29, 185, 84, 0.4)' }}
      onClick={() => {
        if (songUrl) window.open(songUrl, '_blank');
      }}
    >
      {}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '8px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
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
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        )}
      </div>

      {}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#fff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: '4px',
          }}
        >
          {loading ? 'Loading...' : title}
        </div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: '500',
            color: 'rgba(255, 255, 255, 0.9)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: '6px',
          }}
        >
          {artist || 'Spotify'}
        </div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: '500',
            color: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          {playerState === 'PLAY' || playerState === 'PAUSE'
            ? `${pad(minutesPlayed)}:${pad(secondsPlayed)} / ${pad(minutesTotal)}:${pad(secondsTotal)}`
            : 'Not playing'}
        </div>
      </div>

      {}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {playerState === 'PLAY' ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '16px',
              height: '16px',
              background: '#fff',
              borderRadius: '50%',
            }}
          />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z" />
          </svg>
        )}
      </div>
    </motion.div>
  );
}
