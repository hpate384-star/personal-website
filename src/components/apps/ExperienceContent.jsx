import React from 'react'
import { WindowCtx } from '../Window'
import DraggableItem from '../DraggableItem'
import folderImg from '../../assets/finder.png'
import { DocSVG, getInitialPos } from '../WindowContent'

export const EXPERIENCES_DATA = {
  RBC: {
    folderName: 'Royal Bank of Canada',
    fileName: 'RBC_Coop.txt',
    title: 'Fullstack Developer Co-op - Toronto, ON (Sep 2025 – Apr 2026)',
    content: `• Synchronized 30+ ServiceNow fields into a CMDB asset inventory with zero downtime by developing a Python ETL pipeline with SQLAlchemy, paginated REST ingestion, cursor resumption, and staging-table swaps.\n\n• Engineered reactive Spring Boot + WebFlux APIs backed by R2DBC to power a React dashboard tracking EOL status for 3.3M+ assets, implementing server-side pagination and dynamic filtering across 6+ tables.\n\n• Cut API response time by 67% (1.2s → 400ms) by developing Spring Boot microservices with hybrid in-memory and distributed L1/L2 caching using Caffeine and Redis, following MVC architecture and DTO patterns.\n\n• Automated weekly EOL audits using Python and cron scheduling to query SQL Server for stale records and dispatch LangChain-summarized reports through Microsoft Graph API, reducing turnaround from hours to minutes.\n\n• Secured dashboard access by integrating Azure AD SSO into Spring Security and React Context route guards.`
  },
  NSERC: {
    folderName: 'Western University (NSERC)',
    fileName: 'NSERC_Research.txt',
    title: 'Undergraduate Researcher - London, ON (May 2025 – Aug 2025)',
    content: `• Built a Python and Pandas pipeline to migrate and clean 4,000+ fraudulent emails, extracting NLP features via BERT embeddings, TF-IDF, and regex pattern matching to support an LLM-based phishing detection study.\n\n• Designed a Python benchmarking framework that automated inference and scoring across 15 decoder and encoder transformer LLMs, surfacing ChatGPT-4 as top performer at 98% accuracy through Matplotlib visualizations.\n\n• Presented at HSI 2025 in Paris; paper received 15+ citations and 500+ full-text reads (IEEE Digital Library).`
  },
  TSI: {
    folderName: 'Tech for Social Impact',
    fileName: 'TSI_Developer.txt',
    title: 'Fullstack Developer - London, ON (Oct 2024 – Apr 2025)',
    content: `• Designed a normalized PostgreSQL schema using Prisma ORM with 6+ models to support a scalable training platform, enforcing RBAC and enabling real-time employee certification tracking across multiple locations.\n\n• Built reusable frontend components, including responsive login/signup pages, dynamic profile views, and intuitive navigation using React and TypeScript, improving user experience and state management.\n\n• Optimized report generation by building RESTful endpoints with server-side filtering and pagination, enabling CSV/PDF exports stored in AWS S3 by certification, progress, and role, reducing export latency by 70% (10s → 3s).`
  },
  Manulife: {
    folderName: 'Manulife',
    fileName: 'Manulife.txt',
    title: '[Software Engineer Intern Incoming]',
    content: ''
  }
}

export function ExperienceContent({ view, setView, constraintRef, itemPositions, savePosition, savePositionsBatch }) {
  const ctx = React.useContext(WindowCtx)
  const [selected, setSelected] = React.useState([])

  const [localPos, setLocalPos] = React.useState(() => {
    const pos = {}
    const folders = Object.keys(EXPERIENCES_DATA).map(id => ({ id }))
    folders.forEach((item, i) => {
      const key = `exp-cat-${item.id}`
      pos[key] = itemPositions[key] || getInitialPos(i)
    })
    Object.values(EXPERIENCES_DATA).forEach((exp, i) => {
      const key = `exp-file-${exp.fileName}`
      pos[key] = itemPositions[key] || getInitialPos(0)
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
    const folders = Object.keys(EXPERIENCES_DATA).map(id => ({
      id,
      label: EXPERIENCES_DATA[id].folderName
    }))
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }} onClick={() => setSelected([])}>
        {folders.map((item, i) => {
          const posKey = `exp-cat-${item.id}`
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

  const exp = EXPERIENCES_DATA[view]
  const fileKey = `exp-file-${exp.fileName}`
  const pos = localPos[fileKey] || getInitialPos(0)
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} onClick={() => setSelected([])}>
      <DraggableItem
        id={fileKey}
        x={pos.x}
        y={pos.y}
        label={exp.fileName}
        selected={selected.includes(fileKey)}
        onClick={(clickedId, e) => handleItemClick(fileKey, e)}
        onDoubleClick={(clickedId, e) => {
          e.stopPropagation()
          ctx?.openWindow?.(`Notes_${view}`)
        }}
        onDragEnd={handleItemDragEnd}
        onBatchDragEnd={handleBatchDragEnd}
        enableMultiSelect={true}
        containerRef={constraintRef}
      >
        <DocSVG ext="TXT" color="#6e6e73" />
      </DraggableItem>
    </div>
  )
}
