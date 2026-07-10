import React from 'react'
import imessageIcon from '../assets/icnsFile_20d359ab058eb0cf883b6b1690fc8edd_iMessage.png'
import { motion, AnimatePresence } from 'framer-motion'
import { useZIndex } from '../hooks/useZIndex'

export default function ContactWidget() {
  const [expanded, setExpanded] = React.useState(false)
  const [zIndex, bringToFront] = useZIndex(5)

  return (
    <div
      style={{
        position: 'fixed',
        left: '371px',
        top: '64px',
        width: '144px',
        height: '144px',
        zIndex: zIndex,
      }}
      onMouseDown={bringToFront}
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
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          padding: '16px 14px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
          userSelect: 'none',
          cursor: 'grab',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
          e.currentTarget.style.background = '#F9F4F4'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
          e.currentTarget.style.background = '#FBF6F6'
        }}
      >
        <a href="sms:+16472916312" style={{
          textDecoration: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: '6px',
          pointerEvents: 'auto'
        }}>
          <img src={imessageIcon.src} alt="iMessage" width="56" height="56" style={{ objectFit: 'contain', pointerEvents: 'none' }} />
          <span style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#1d1d1f',
            letterSpacing: '-0.3px',
            lineHeight: '1.2',
            pointerEvents: 'none'
          }}>
            Contact Me
          </span>
        </a>
      </div>
    </div>
  )
}
