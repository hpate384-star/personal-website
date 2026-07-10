
import React, { useState, useEffect } from 'react'

const AppleLogo = () => (
  <img
    src="/apple.png"
    alt="Apple"
    draggable={false}
    style={{
      width: '15px',
      height: '15px',
      objectFit: 'contain',
      flexShrink: 0,
      filter: 'brightness(0) invert(1)',
      position: 'relative',
      top: '-0.5px',
    }}
  />
)

const BatteryIcon = () => (
  <svg width="23" height="12" viewBox="0 0 22 11" fill="none" style={{ flexShrink: 0 }}>
    <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="#fff" strokeOpacity="0.9" strokeWidth="1" />
    <path d="M20 3.5C20.5523 3.5 21 3.94772 21 4.5V6.5C21 7.05228 20.5523 7.5 20 7.5" stroke="#fff" strokeOpacity="0.9" strokeWidth="1" strokeLinecap="round" />
    <rect x="2.5" y="2.5" width="14" height="6" rx="1" fill="#fff" fillOpacity="0.9" />
  </svg>
)

const WifiIcon = () => (
  <img
    src="/wifi.png"
    alt="Wi-Fi"
    draggable={false}
    style={{
      width: '16px',
      height: '16px',
      objectFit: 'contain',
      flexShrink: 0,
      filter: 'brightness(0) invert(1)',
    }}
  />
)

const SpotlightIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="6.5" cy="6.5" r="4.75" stroke="#fff" strokeOpacity="0.9" strokeWidth="1.5" />
    <line x1="9.85355" y1="9.85355" x2="13.5" y2="13.5" stroke="#fff" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ControlCenterIcon = () => (
  <img
    src="/control.png"
    alt="Control Center"
    draggable={false}
    style={{
      width: '16px',
      height: '16px',
      objectFit: 'contain',
      flexShrink: 0,
      filter: 'brightness(0) invert(1)',
    }}
  />
)

export const menuConfig = {
  Finder: ['File', 'Edit', 'View', 'Go', 'Window', 'Help'],
  Safari: ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Window', 'Help'],
  'VS Code': ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Window', 'Help'],
  Photos: ['File', 'Edit', 'Image', 'View', 'Window', 'Help'],
  Notes: ['File', 'Edit', 'Format', 'View', 'Window', 'Help'],
}

function useClock() {
  const [time, setTime] = useState(null)
  useEffect(() => {
    
    setTime(formatTime(new Date()))
    
    const id = setInterval(() => setTime(formatTime(new Date())), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function formatTime(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = days[date.getDay()]
  const month = months[date.getMonth()]
  const dateNum = date.getDate()
  let hours = date.getHours()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${dateNum}  ${hours}:${minutes} ${ampm}`
}

export default function MenuBar({ activeApp }) {
  const time = useClock()
  const displayApp = activeApp.startsWith('Notes_') ? 'Notes' : activeApp
  const menuItems = menuConfig[displayApp] || menuConfig.Finder

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '30px',
        zIndex: 50,
        background: 'rgba(80, 110, 185, 0.38)',
        backdropFilter: 'blur(20px) saturate(120%)',
        WebkitBackdropFilter: 'blur(20px) saturate(120%)',
        borderBottom: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '12px',
        paddingRight: '12px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
        fontSize: '13px',
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.95)',
      }}
    >
      {}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AppleLogo />
        <span style={{ fontWeight: 800, cursor: 'default', letterSpacing: '-0.02em', WebkitTextStroke: '0.5px rgba(255,255,255,0.8)' }}>{displayApp}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {menuItems.map(item => (
            <span
              key={item}
              style={{
                cursor: 'default',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'background 150ms ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {}
      <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
        <BatteryIcon />
        <WifiIcon />
        <SpotlightIcon />
        <ControlCenterIcon />
        <span style={{ fontWeight: 500, letterSpacing: '0.01em', whiteSpace: 'nowrap', cursor: 'default', minWidth: '140px' }}>
          {time || '\u00A0'}
        </span>
      </div>
    </div>
  )
}
