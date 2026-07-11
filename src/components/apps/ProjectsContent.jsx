import React from 'react'
import { WindowCtx } from '../Window'
import DraggableItem from '../DraggableItem'
import folderImg from '../../assets/finder.png'
import { DocSVG, getInitialPos } from '../WindowContent'
import { saveLastOpened } from '../../lib/supabase'


import img1 from '../../assets/Snip/1.png'
import img2 from '../../assets/Snip/2.png'
import img3 from '../../assets/Snip/3.png'
import img4 from '../../assets/Snip/4.png'
import img5 from '../../assets/Snip/5.png'
import img6 from '../../assets/Snip/6.png'

import sImg1 from '../../assets/Sonivo/1.png'
import sImg2 from '../../assets/Sonivo/2.png'
import sImg3 from '../../assets/Sonivo/3.png'
import sImg4 from '../../assets/Sonivo/4.png'
import sImg5 from '../../assets/Sonivo/5.png'

import nImg1 from '../../assets/nouri/1.png'
import nImg2 from '../../assets/nouri/2.png'
import nImg3 from '../../assets/nouri/3.png'
import nImg4 from '../../assets/nouri/4.png'
import nImg5 from '../../assets/nouri/5.png'

import chatrlinkImg1 from '../../assets/chatrlink/1.png'
import chatrlinkImg2 from '../../assets/chatrlink/2.png'
import chatrlinkImg3 from '../../assets/chatrlink/3.png'

import githubIcon from '../../assets/github.svg'

export const PROJECTS_DATA = {
  Snip: {
    folderName: 'Snip',
    fileName: 'Snip_Details.txt',
    title: 'Smart Clipboard Manager',
    content: `A macOS menu bar and utility app built with Swift that monitors and manages clipboard history, featuring advanced sequential multi-pasting (FIFO/LIFO) and  database sync.\n\n• Asynchronous Clipboard Processing (Swift/macOS): Engineered a multi-threaded monitoring service that intercepts NSPasteboard events and offloads parsing of RTF/HTML content, image assets, and text to background threads to prevent main-thread UI lag.\n\n• Sequential Multi-Paste Engine (FIFO/LIFO): Developed a "PsychoCopy" queuing system enabling users to capture multiple items in sequence and paste them back in either First-In-First-Out (FIFO) or Last-In-First-Out (LIFO) order by intercepting global keyboard hotkeys.\n\n• Cloud Sync & Relational Schema (Supabase/PostgreSQL): Designed a secure synchronization layer using Supabase and PostgreSQL to store structured clipboard metadata, implementing storage bucket uploads for binary files and GIN indexing for fast historical searches.`,
    images: [
      { id: 'img1', src: img1.src || img1, label: '1.png' },
      { id: 'img2', src: img2.src || img2, label: '2.png' },
      { id: 'img3', src: img3.src || img3, label: '3.png' },
      { id: 'img4', src: img4.src || img4, label: '4.png' },
      { id: 'img5', src: img5.src || img5, label: '5.png' },
      { id: 'img6', src: img6.src || img6, label: '6.png' },
    ],
    githubUrl: 'https://github.com/Hetp04/Snip/tree/main'
  },
  Sonivo: {
    folderName: 'Sonivo',
    fileName: 'Sonivo_Details.txt',
    title: 'AI Piano Improvisation',
    content: `An AI-driven piano improvisation platform that processes musical notes in real time, validating randomly generated melodies against key signature and voice-leading music theory rules.\n\n• Implemented a music theory validation layer that filters and corrects Magenta's raw model output against key signature and voice-leading rules, ensuring generated suggestions stay harmonically playable in real time.\n\n• Developed an AI-driven piano improvisation platform that analyzes note sequences to generate compositional suggestions, produce backing tracks, and visualize music theory concepts; winner at United Hacks 2025.\n\n• Integrated Magenta’s pretrained music generation models with a NumPy sequence processing pipeline to analyze melodic input and generate harmonically consistent chord progressions in real time`,
    images: [
      { id: '1', src: sImg1.src || sImg1, label: '1.png' },
      { id: '2', src: sImg2.src || sImg2, label: '2.png' },
      { id: '3', src: sImg3.src || sImg3, label: '3.png' },
      { id: '4', src: sImg4.src || sImg4, label: '4.png' },
      { id: '5', src: sImg5.src || sImg5, label: '5.png' }
    ],
    githubUrl: 'https://github.com/Hetp04/Sonivo-Music-Composiiton-Platform'
  },
  Nouri: {
    folderName: 'Nouri',
    fileName: 'Nouri_Details.txt',
    title: 'Serverless AI Food Ingredient Scoring',
    content: `A iOS application designed with SwiftUI and AWS Lambda that uses LLMs to analyze food ingredient labels on-the-fly and fetch peer-reviewed dietary health risk ratings.\n\n• Architected a Python-based AWS Lambda backend integrating Groq LLMs and OpenFoodFacts/USDA databases to evaluate food ingredients, implementing a Perplexity AI search fallback to crawl and parse product labels on-the-fly when databases lacked information.\n\n• Designed an AWS DynamoDB caching layer featuring TTL-based expiration and a custom scoring schema versioning mechanism to automatically invalidate stale data, reducing external API costs and latency.\n\n• Developed a rich SwiftUI mobile interface featuring dynamic food processing scales, risk/benefit ingredient flags, and verifiable peer-reviewed scientific citations to provide users with transparent, evidence-based dietary assessments.`,
    images: [
      { id: '1', src: nImg1.src || nImg1, label: '1.png' },
      { id: '2', src: nImg2.src || nImg2, label: '2.png' },
      { id: '3', src: nImg3.src || nImg3, label: '3.png' },
      { id: '4', src: nImg4.src || nImg4, label: '4.png' },
      { id: '5', src: nImg5.src || nImg5, label: '5.png' }
    ],
    githubUrl: 'https://github.com/Hetp04/Nouri'
  },
  Chatrlink: {
    folderName: 'Chatrlink',
    fileName: 'Chatrlink_Details.txt',
    title: 'Real-Time Chat Application',
    content: `A real-time chat application built with Spring Boot and React, made to scale on a Kubernetes cluster with a fully automated GitOps deployment pipeline using Argo CD.\n\n• Developed a real-time chat application using Spring Boot and React, implementing WebSockets for instant message delivery and MongoDB to persist chat history.\n\n• Deployed the application on a Kubernetes cluster, configuring separate frontend and backend services (2 replicas each) using ClusterIP and an Ingress controller for load balancing, traffic routing, and support for 1,000+ concurrent users.\n\n• Configured the GitHub Actions workflow to automatically extract Git commit SHAs to tag Docker images, writing these new versions into GitLab Helm charts for automated deployment via Argo CD.`,
    images: [
      { id: 'img1', src: chatrlinkImg1.src || chatrlinkImg1, label: '1.png' },
      { id: 'img2', src: chatrlinkImg2.src || chatrlinkImg2, label: '2.png' },
      { id: 'img3', src: chatrlinkImg3.src || chatrlinkImg3, label: '3.png' },
    ],
    githubUrl: 'https://github.com/Hetp04/Chatr'
  }
}

export function ProjectsContent({ view, setView, constraintRef, itemPositions, savePosition, savePositionsBatch }) {
  const ctx = React.useContext(WindowCtx)
  const [selected, setSelected] = React.useState([])

  const [localPos, setLocalPos] = React.useState(() => {
    const pos = {}
    const folders = Object.keys(PROJECTS_DATA).map(id => ({ id }))
    folders.forEach((item, i) => {
      const key = `proj-cat-${item.id}`
      pos[key] = itemPositions[key] || getInitialPos(i)
    })


    Object.values(PROJECTS_DATA).forEach((proj, projIndex) => {
      const keyFile = `proj-file-${proj.fileName}`
      pos[keyFile] = itemPositions[keyFile] || getInitialPos(0)

      proj.images.forEach((img, i) => {
        const keyImg = `proj-img-${proj.folderName}-${img.id}`
        pos[keyImg] = itemPositions[keyImg] || getInitialPos(i + 1)
      })
      if (proj.githubUrl) {
        const keyGit = `proj-github-${proj.folderName}`
        pos[keyGit] = itemPositions[keyGit] || getInitialPos(proj.images.length + 1)
      }
    })
    return pos
  })

  const handleItemDragEnd = (id, x, y) => {
    setLocalPos(prev => ({ ...prev, [id]: { x, y } }))
    savePosition(id, x, y)
  }

  const handleBatchDragEnd = (deltaX, deltaY) => {
    setLocalPos(prev => {
      const next = { ...prev }
      const batchUpdates = []
      selected.forEach(itemId => {
        if (next[itemId]) {
          const newX = next[itemId].x + deltaX
          const newY = next[itemId].y + deltaY
          next[itemId] = { x: newX, y: newY }
          batchUpdates.push({ itemId, x: newX, y: newY })
        }
      })
      if (batchUpdates.length > 0 && typeof savePositionsBatch === 'function') {
        savePositionsBatch(batchUpdates)
      }
      return next
    })
  }

  const handleItemClick = (id, e) => {
    e.stopPropagation()
    const isMultiSelectKey = e.metaKey || e.ctrlKey
    if (isMultiSelectKey) {
      setSelected(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
    } else {
      setSelected([id])
    }
  }

  if (view === 'root') {
    const folders = Object.keys(PROJECTS_DATA).map(id => ({
      id,
      label: PROJECTS_DATA[id].folderName
    }))
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }} onClick={() => setSelected([])}>
        {folders.map((item, i) => {
          const posKey = `proj-cat-${item.id}`
          const pos = localPos[posKey] || getInitialPos(i)
          return (
            <DraggableItem
              key={item.id}
              id={posKey}
              x={pos.x}
              y={pos.y}
              label={item.label}
              img={folderImg.src}
              selected={selected.includes(posKey)}
              onClick={(clickedId, e) => handleItemClick(posKey, e)}
              onDoubleClick={(clickedId, e) => { e.stopPropagation(); setView(item.id) }}
              onDragEnd={handleItemDragEnd}
              onBatchDragEnd={handleBatchDragEnd}
              enableMultiSelect={true}
              containerRef={constraintRef}
            />
          )
        })}
      </div>
    )
  }

  const LinkBadge = ({ href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        bottom: '-2px',
        right: '-2px',
        background: '#fff',
        borderRadius: '50%',
        width: '18px',
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        border: '1px solid #e0e0e0',
        zIndex: 10,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </a>
  )

  const proj = PROJECTS_DATA[view]
  const fileKey = `proj-file-${proj.fileName}`
  const filePos = localPos[fileKey] || getInitialPos(0)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} onClick={() => setSelected([])}>
      { }
      <DraggableItem
        id={fileKey}
        x={filePos.x}
        y={filePos.y}
        label={proj.fileName}
        selected={selected.includes(fileKey)}
        onClick={(clickedId, e) => handleItemClick(fileKey, e)}
        onDoubleClick={(clickedId, e) => {
          e.stopPropagation()
          ctx?.openWindow?.(`Notes_${view}_proj`)
        }}
        onDragEnd={handleItemDragEnd}
        onBatchDragEnd={handleBatchDragEnd}
        enableMultiSelect={true}
        containerRef={constraintRef}
      >
        <DocSVG ext="TXT" color="#6e6e73" />
      </DraggableItem>

      { }
      {proj.images.map((img, i) => {
        const imgKey = `proj-img-${proj.folderName}-${img.id}`
        const pos = localPos[imgKey] || getInitialPos(i + 1)
        return (
          <DraggableItem
            key={imgKey}
            id={imgKey}
            x={pos.x}
            y={pos.y}
            label={img.label}
            img={img.src}
            selected={selected.includes(imgKey)}
            onClick={(clickedId, e) => handleItemClick(imgKey, e)}
            onDoubleClick={(clickedId, e) => {
              e.stopPropagation()
              const previewId = `Preview_${view}_${img.id}`
              saveLastOpened('finder_preview', previewId)
              ctx?.openWindow?.(previewId)
            }}
            onDragEnd={handleItemDragEnd}
            onBatchDragEnd={handleBatchDragEnd}
            enableMultiSelect={true}
            containerRef={constraintRef}
          />
        )
      })}

      { }
      {proj.githubUrl && (() => {
        const gitKey = `proj-github-${proj.folderName}`
        const pos = localPos[gitKey] || getInitialPos(proj.images.length + 1)
        return (
          <DraggableItem
            key={gitKey}
            id={gitKey}
            x={pos.x}
            y={pos.y}
            label="GitHub"
            selected={selected.includes(gitKey)}
            onClick={(clickedId, e) => handleItemClick(gitKey, e)}
            onDoubleClick={(clickedId, e) => {
              e.stopPropagation()
              window.open(proj.githubUrl, '_blank')
            }}
            onDragEnd={handleItemDragEnd}
            onBatchDragEnd={handleBatchDragEnd}
            enableMultiSelect={true}
            containerRef={constraintRef}
          >
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={githubIcon.src || githubIcon}
                alt="GitHub"
                draggable={false}
                style={{ width: 52, height: 52, borderRadius: '8px', display: 'block', pointerEvents: 'none' }}
              />
              <LinkBadge href={proj.githubUrl} />
            </div>
          </DraggableItem>
        )
      })()}
    </div>
  )
}
