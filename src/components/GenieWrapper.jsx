"use client";

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'


export default function GenieWrapper({
  id,
  isOpen,
  isClosing,
  traySlotX,
  traySlotY,
  pos,
  size,
  onFocus,
  onFullyClosed,
  children,
  style,
  zIndex,
  domRef,
}) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900

  
  const targetX = traySlotX ?? vw / 2
  const targetY = traySlotY ?? vh - 60

  
  const windowCenterX = pos.x + size.w / 2
  const windowCenterY = pos.y + size.h / 2
  const ox = targetX - windowCenterX
  const oy = targetY - windowCenterY

  const springIn = { type: 'spring', stiffness: 350, damping: 32, mass: 0.8 }
  const easeOut = { duration: 0.15, ease: 'easeOut' }
  const easeIn = { duration: 0.15, ease: 'easeIn', delay: 0.05 }
  const slideOut = { duration: 0.38, ease: [0.16, 1, 0.3, 1] }

  const handleExitComplete = () => {
    if (isClosing && onFullyClosed) onFullyClosed(id)
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isOpen && (
        <motion.div
          ref={domRef}
          key={`genie-${id}`}
          initial={{
            x: ox,
            y: oy,
            scale: 0.05,
            opacity: 0,
          }}
          animate={{
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            transition: {
              x: springIn,
              y: springIn,
              scale: springIn,
              opacity: easeOut,
            },
          }}
          exit={{
            x: ox,
            y: oy,
            scale: 0.05,
            opacity: 0,
            transition: {
              x: slideOut,
              y: slideOut,
              scale: slideOut,
              opacity: easeIn,
            },
          }}
          onMouseDown={onFocus}
          style={{
            ...style,
            position: 'fixed',
            left: pos.x,
            top: pos.y,
            width: size.w,
            height: size.h,
            zIndex,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            transformOrigin: 'center center',
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
