import React from 'react'
import { useZIndex } from '../hooks/useZIndex'

import gmailIcon from '../assets/gmail.png'
import callIcon from '../assets/call.png'
import educationIcon from '../assets/mortarboard.png'
import locationIcon from '../assets/google-maps.png'
import profileImg from '../assets/me.jpg'

export default function DesktopWidget() {
  const [zIndex, bringToFront] = useZIndex(5)

  return (
    <div
      onMouseDown={bringToFront}
      style={{
        position: 'fixed',
        left: '32px',
        top: '64px',
        width: '327px',
        height: '144px',
        zIndex,
      }}
    >
      {}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: '#FBF6F6',
          borderRadius: '24px',
          border: '2px solid rgba(0, 0, 0, 0.12)',
          display: 'flex',
          alignItems: 'stretch',
          boxSizing: 'border-box',
          gap: '12px',
          padding: '16px 14px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
          userSelect: 'none',
          color: '#1d1d1f',
        }}>

        {}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          flex: '0 0 110px',
          minWidth: 0,
          gap: '6px'
        }}>
          <img
            src={profileImg.src}
            alt="Het Patel"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
              border: '1px solid rgba(0, 0, 0, 0.08)'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', width: '100%' }}>
            <h2 style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: '600',
              color: '#1d1d1f',
              letterSpacing: '-0.2px',
              lineHeight: '1.2',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Het Patel
            </h2>
            <div style={{
              fontSize: '11px',
              color: '#86868b',
              fontWeight: '500',
              lineHeight: '1.2',
              wordBreak: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              Software Engineer<br />@ Manulife
            </div>
          </div>
        </div>

        {}
        <div style={{ width: '1px', background: 'rgba(0, 0, 0, 0.08)', flexShrink: 0 }} />

        {}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '10px',
          flex: '1',
          minWidth: 0
        }}>
          {}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={gmailIcon.src} alt="Email" width="14" height="14" style={{ flexShrink: 0, objectFit: 'contain' }} />
            <a href="mailto:hetpate384@gmail.com" style={{
              fontSize: '12px',
              color: '#1d1d1f',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              fontWeight: '500'
            }}>
              hetpate384@gmail.com
            </a>
          </div>

          {}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={callIcon.src} alt="Phone" width="14" height="14" style={{ flexShrink: 0, objectFit: 'contain' }} />
            <a href="tel:+16472916312" style={{
              fontSize: '12px',
              color: '#1d1d1f',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              fontWeight: '500'
            }}>
              +1 647 291 6312
            </a>
          </div>

          {}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={educationIcon.src} alt="University" width="14" height="14" style={{ flexShrink: 0, objectFit: 'contain' }} />
            <span style={{
              fontSize: '12px',
              color: '#1d1d1f',
              whiteSpace: 'nowrap',
              fontWeight: '500'
            }}>
              Western University
            </span>
          </div>

          {}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={locationIcon.src} alt="Location" width="14" height="14" style={{ flexShrink: 0, objectFit: 'contain' }} />
            <span style={{
              fontSize: '12px',
              color: '#1d1d1f',
              whiteSpace: 'nowrap',
              fontWeight: '500'
            }}>
              London, ON
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
