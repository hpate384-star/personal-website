"use client";

import React from 'react'
import { motion } from 'framer-motion'
import { WindowCtx, TrafficLights } from './Window'
import DraggableItem from './DraggableItem'
import folderImg from '../assets/finder.png'
import hddImg from '../assets/hdd.png'
import profileImg from '../assets/me.jpg'
import gmailIcon from '../assets/gmail.png'
import callIcon from '../assets/call.png'
import eduIcon from '../assets/mortarboard.png'
import locationIcon from '../assets/google-maps.png'
import zipImg from '../assets/zip.png'
import linkedinIcon from '../assets/linkedin.svg'
import researchgateIcon from '../assets/ResearchGate.png'
import instagramIcon from '../assets/instagram.svg'
import githubIcon from '../assets/github.svg'
import { supabase, getOrCreateSessionId } from '../lib/supabase'
import { useAboutMeData } from '../hooks/useAboutMeData'
import { IMessageContent } from './iMessageContent'
import txtFileIcon from '../assets/txt_file.png'

import { AboutMeContent } from './apps/AboutMeContent'
import { ExperienceContent } from './apps/ExperienceContent'
import { SkillsContent } from './apps/SkillsContent'
import { NotesContent } from './apps/NotesContent'
import { SafariContent } from './apps/SafariContent'
import { VSCodeContent } from './apps/VSCodeContent'
import { PhotosContent } from './apps/PhotosContent'
import { SpotifyContent } from './apps/SpotifyContent'
import { ProjectsContent, PROJECTS_DATA } from './apps/ProjectsContent'
import { PreviewContent } from './apps/PreviewContent'

export function PlaceholderSection({ label, height = 60, color = '#f5f5f7' }) {
  return (
    <div style={{
      height,
      background: color,
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#86868b',
      fontSize: '13px',
      fontWeight: 500,
      border: '1.5px dashed #d1d1d6',
    }}>
      {label}
    </div>
  )
}


const PortfolioIcon = ({ type, active }) => {
  const c = '#007aff'
  const s = { width: 16.5, height: 16.5, flexShrink: 0 }
  switch (type) {
    case 'person': return <svg style={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="3" stroke={c} strokeWidth="1.3" /><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={c} strokeWidth="1.3" strokeLinecap="round" /></svg>
    case 'briefcase': return <svg style={s} viewBox="0 0 16 16" fill="none"><rect x="2" y="5" width="12" height="9" rx="1.5" stroke={c} strokeWidth="1.3" /><path d="M5.5 5V4a2.5 2.5 0 0 1 5 0v1" stroke={c} strokeWidth="1.3" /><path d="M2 9h12" stroke={c} strokeWidth="1.1" /></svg>
    case 'doc': return <svg style={s} viewBox="0 0 16 16" fill="none"><path d="M4 2h5.5L12 4.5V14H4V2z" stroke={c} strokeWidth="1.3" /><path d="M9.5 2v2.5H12" stroke={c} strokeWidth="1.1" strokeLinecap="round" /><path d="M6 8h4M6 10.5h3" stroke={c} strokeWidth="1" strokeLinecap="round" /></svg>
    case 'star': return <svg style={s} viewBox="0 0 16 16" fill="none"><path d="M8 2l1.8 3.6L14 6.4l-3 2.9.7 4.1L8 11.5 4.3 13.4l.7-4.1-3-2.9 4.2-.8z" stroke={c} strokeWidth="1.3" strokeLinejoin="round" /></svg>
    case 'graduation': return <svg style={s} viewBox="0 0 16 16" fill="none"><path d="M8 3L2 6.5l6 3.5 6-3.5z" stroke={c} strokeWidth="1.3" strokeLinejoin="round" /><path d="M4.5 8.2V11.5c0 0 1.2 1.5 3.5 1.5s3.5-1.5 3.5-1.5V8.2" stroke={c} strokeWidth="1.2" strokeLinecap="round" /><path d="M13.5 6.5v3" stroke={c} strokeWidth="1.3" strokeLinecap="round" /></svg>
    case 'folder': return <svg style={s} viewBox="0 0 16 16" fill="none"><path d="M2 4h5l1.5 2H14v7H2V4z" stroke={c} strokeWidth="1.3" strokeLinejoin="round" /></svg>
    default: return null
  }
}


const FolderSVG = ({ color = '#4fa8e8' }) => (
  <svg width="56" height="48" viewBox="0 0 56 48" fill="none">
    <path d="M2 10h18l4 5h28a2 2 0 0 1 2 2v27a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V12" fill={color} />
    <path d="M2 10h18l4 5h28a2 2 0 0 1 2 2v27a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V12" fill="url(#fg)" />
    <defs>
      <linearGradient id="fg" x1="28" y1="10" x2="28" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
        <stop offset="1" stopColor="#000" stopOpacity="0.06" />
      </linearGradient>
    </defs>
  </svg>
)

export const DocSVG = ({ ext = 'PDF', color = '#e05252' }) => {
  if (ext === 'TXT' || ext === 'txt') {
    return <img src={txtFileIcon.src} alt="TXT" style={{ width: 44, height: 46, objectFit: 'contain' }} />
  }
  return (
    <svg width="44" height="54" viewBox="0 0 44 54" fill="none">
      <rect x="1" y="1" width="42" height="52" rx="4" fill="#fff" stroke="#d1d1d6" strokeWidth="1" />
      <path d="M28 1v12h14" fill="none" stroke="#d1d1d6" strokeWidth="1" />
      <path d="M28 1l14 12H28z" fill="#f0f0f5" />
      <rect x="0" y="33" width="44" height="14" rx="0" fill={color} />
      <rect x="0" y="39" width="44" height="8" rx="0" fill={color} />
      <text x="22" y="48" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="system-ui" fontWeight="700">{ext}</text>
    </svg>
  )
}

const SIDEBAR_SECTIONS = [
  { id: 'About Me', icon: 'person' },
  { id: 'Experience', icon: 'briefcase' },
  { id: 'Skills', icon: 'star' },
  { id: 'Projects', icon: 'folder' },
  { id: 'Academia', icon: 'graduation' },
  { id: 'Resume', icon: 'doc' },
]

const SECTION_ICONS = {
  'About Me': [],
  'Experience': [],
  'Skills': [],
  'Projects': [],
  'Academia': [],
  'Resume': [],
}


export function getInitialPos(i) {
  const col = i % 4
  const row = Math.floor(i / 4)
  return { x: 28 + col * 110, y: 24 + row * 100 }
}


const Ico = ({ d, viewBox = '0 0 16 16', stroke = '#4a4a4a', strokeWidth = 1.2, fill = 'none', w = 16, h = 16, children, strokeOpacity }) => (
  <svg width={w} height={h} viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={strokeOpacity} style={{ flexShrink: 0 }}>
    {d ? <path d={d} /> : children}
  </svg>
)


const ChevDn = () => (
  <svg width="7" height="5" viewBox="0 0 7 5" fill="none" stroke="#4a4a4a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 1, flexShrink: 0, opacity: 0.8 }}>
    <path d="M1 1l2.5 3L6 1" />
  </svg>
)


const ViewBtn = ({ active, title, children }) => (
  <button title={title} style={{
    width: 28, height: 22, border: 'none', cursor: 'default', padding: 0, flexShrink: 0,
    background: 'transparent',
    opacity: active ? 1 : 0.4,
    borderRadius: 4,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>{children}</button>
)


const NavBtn = ({ children, opacity, onClick }) => {
  const [hover, setHover] = React.useState(false)
  const disabled = opacity === 0.25
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: !disabled && hover ? 'rgba(0, 0, 0, 0.06)' : 'none',
        border: 'none',
        padding: '3px 6px',
        borderRadius: 5,
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        opacity: opacity,
        transition: 'background 120ms',
      }}
    >
      {children}
    </button>
  )
}

const ViewOptionsBtn = ({ children }) => {
  const [hover, setHover] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        height: 28, cursor: 'default', flexShrink: 0,
        padding: '0 8px', borderRadius: 5,
        background: hover ? 'rgba(0, 0, 0, 0.06)' : 'transparent',
        transition: 'background 120ms',
      }}
    >
      {children}
    </div>
  )
}

const TbBtn = ({ children, title, withChevron }) => {
  const [hover, setHover] = React.useState(false)
  return (
    <div
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 0,
        height: 28, cursor: 'default', flexShrink: 0,
        borderRadius: 5,
        padding: '0 8px',
        background: hover ? 'rgba(0, 0, 0, 0.06)' : 'transparent',
        transition: 'background 120ms',
      }}
    >
      {children}
      {withChevron && <ChevDn />}
    </div>
  )
}

const MoreOptionsBtn = ({ children }) => {
  const [hover, setHover] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        height: 28, cursor: 'default', flexShrink: 0,
        padding: '0 8px', borderRadius: 5,
        background: hover ? 'rgba(0, 0, 0, 0.06)' : 'transparent',
        transition: 'background 120ms',
      }}
    >
      {children}
    </div>
  )
}

function InfoRow({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <img src={icon} alt="" width="15" height="15" style={{ flexShrink: 0, objectFit: 'contain' }} />
      <span style={{ fontSize: 12.5, color: '#1c1c1e', fontWeight: 500 }}>{children}</span>
    </div>
  )
}

const EXPERIENCES_DATA = {
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
  }
}

const SKILLS_DATA = {
  Languages: ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'SQL'],
  'Frameworks & Libraries': ['React.js', 'Node.js', 'Spring Boot', 'FastAPI', 'LangChain', 'OpenCV', 'NumPy', 'Pandas'],
  Databases: ['PostgreSQL', 'MongoDB', 'Microsoft SQL Server', 'Redis'],
  'Tools & DevOps': ['Docker', 'Kubernetes', 'Git', 'Jenkins', 'Jira', 'AWS (S3, Lambda)', 'MS Office', 'UML', 'CI/CD']
}



export function FinderContent() {
  const ctx = React.useContext(WindowCtx)
  const [active, setActive] = React.useState('About Me')
  const [selectedMainIcons, setSelectedMainIcons] = React.useState([])
  
  
  const [aboutMeView, setAboutMeView] = React.useState('zip')
  const { folders: aboutMeFolders, setFolders: setAboutMeFolders, itemPositions, setItemPositions } = useAboutMeData()
  
  
  const [expView, setExpView] = React.useState('root') 
  const [expOpenedFile, setExpOpenedFile] = React.useState(false)

  
  const [skillsView, setSkillsView] = React.useState('root')

  
  const [projView, setProjView] = React.useState('root')

  const [searchExpanded, setSearchExpanded] = React.useState(false)
  const searchInputRef = React.useRef(null)
  const constraintRef = React.useRef(null)
  const icons = SECTION_ICONS[active] || []

  
  const savePosition = React.useCallback(async (itemId, x, y) => {
    if (!supabase) return
    try {
      const sessionId = getOrCreateSessionId()
      const { error } = await supabase
        .from('item_positions')
        .upsert({
          session_id: sessionId,
          item_id: itemId,
          x,
          y,
        }, {
          onConflict: 'session_id,item_id'
        })
      if (error) console.error('[Supabase] Failed to save position:', error)
    } catch (err) {
      console.error('[Supabase] Unexpected error saving position:', err)
    }
  }, [])

  const savePositionsBatch = React.useCallback(async (updatesArray) => {
    if (!supabase || updatesArray.length === 0) return
    try {
      const sessionId = getOrCreateSessionId()
      const payload = updatesArray.map(u => ({
        session_id: sessionId,
        item_id: u.itemId,
        x: u.x,
        y: u.y,
      }))
      const { error } = await supabase
        .from('item_positions')
        .upsert(payload, {
          onConflict: 'session_id,item_id'
        })
      if (error) console.error('[Supabase] Failed to save batch positions:', error)
    } catch (err) {
      console.error('[Supabase] Unexpected error saving batch positions:', err)
    }
  }, [])

  const handleMainIconDragEnd = React.useCallback((id, x, y) => {
    setItemPositions(prev => ({ ...prev, [id]: { x, y } }))
    savePosition(id, x, y)
  }, [setItemPositions, savePosition])

  const handleMainBatchDragEnd = React.useCallback((deltaX, deltaY) => {
    setItemPositions(prev => {
      const newPositions = { ...prev }
      const batchUpdates = []
      selectedMainIcons.forEach(itemId => {
        if (newPositions[itemId]) {
          const newX = newPositions[itemId].x + deltaX
          const newY = newPositions[itemId].y + deltaY
          newPositions[itemId] = { x: newX, y: newY }
          batchUpdates.push({ itemId, x: newX, y: newY })
        }
      })
      if (batchUpdates.length > 0) {
        savePositionsBatch(batchUpdates)
      }
      return newPositions
    })
  }, [selectedMainIcons, setItemPositions, savePositionsBatch])

  const handleMainIconClick = (id, e) => {
    e.stopPropagation()
    const isMultiSelectKey = e.metaKey || e.ctrlKey
    if (isMultiSelectKey) {
      setSelectedMainIcons(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
    } else {
      setSelectedMainIcons([id])
    }
  }

  
  React.useEffect(() => {
    if (active !== 'About Me') setAboutMeView('zip')
    if (active !== 'Experience') {
      setExpView('root')
      setExpOpenedFile(false)
    }
    if (active !== 'Skills') {
      setSkillsView('root')
    }
    if (active !== 'Projects') {
      setProjView('root')
    }
  }, [active])

  
  const handleBackAboutMe = () => {
    if (aboutMeView !== 'zip') setAboutMeView('zip')
  }

  const handleBackExperience = () => {
    if (expView !== 'root') {
      setExpView('root')
    }
  }

  const handleBackSkills = () => {
    if (skillsView !== 'root') {
      setSkillsView('root')
    }
  }

  const handleBackProjects = () => {
    if (projView !== 'root') setProjView('root')
  }

  const handleBack = () => {
    if (active === 'About Me') handleBackAboutMe()
    else if (active === 'Experience') handleBackExperience()
    else if (active === 'Skills') handleBackSkills()
    else if (active === 'Projects') handleBackProjects()
  }

  const canGoBack = (active === 'About Me' && (aboutMeView === 'content' || aboutMeView === 'contact')) ||
                    (active === 'Experience' && expView !== 'root') ||
                    (active === 'Skills' && skillsView !== 'root') ||
                    (active === 'Projects' && projView !== 'root')

  
  const getCurrentDisplayName = () => {
    if (active === 'About Me') {
      if (aboutMeView === 'content') return 'about_me'
      else if (aboutMeView === 'contact') return 'Contact'
    } else if (active === 'Experience') {
      if (expView !== 'root') return EXPERIENCES_DATA[expView]?.folderName || 'Experience'
    } else if (active === 'Skills') {
      if (skillsView !== 'root') return skillsView
    } else if (active === 'Projects') {
      if (projView !== 'root') return PROJECTS_DATA[projView]?.folderName || 'Projects'
    }
    return active
  }

  
  const getPathBreadcrumbs = () => {
    const basePath = [
      { icon: hddImg.src, label: 'Macintosh HD' },
      { icon: folderImg.src, label: 'Users' },
      { icon: folderImg.src, label: 'hetpatel' },
      { icon: folderImg.src, label: 'Portfolio' },
    ]

    if (active === 'About Me') {
      basePath.push({ icon: folderImg.src, label: 'About Me', isActive: aboutMeView === 'zip' })
      if (aboutMeView === 'content') basePath.push({ icon: folderImg.src, label: 'about_me', isActive: true })
      else if (aboutMeView === 'contact') basePath.push({ icon: folderImg.src, label: 'Contact', isActive: true })
    } else if (active === 'Experience') {
      basePath.push({ icon: folderImg.src, label: 'Experience', isActive: expView === 'root' })
      if (expView !== 'root') {
        const fName = EXPERIENCES_DATA[expView]?.folderName
        basePath.push({ icon: folderImg.src, label: fName, isActive: true })
      }
    } else if (active === 'Skills') {
      basePath.push({ icon: folderImg.src, label: 'Skills', isActive: skillsView === 'root' })
      if (skillsView !== 'root') {
        basePath.push({ icon: folderImg.src, label: skillsView, isActive: true })
      }
    } else if (active === 'Projects') {
      basePath.push({ icon: folderImg.src, label: 'Projects', isActive: projView === 'root' })
      if (projView !== 'root') {
        const fName = PROJECTS_DATA[projView]?.folderName
        basePath.push({ icon: folderImg.src, label: fName, isActive: true })
      }
    } else {
      basePath.push({ icon: folderImg.src, label: active, isActive: true })
    }

    return basePath
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', background: 'transparent', overflow: 'hidden' }}>

      {}
      <div style={{
        width: 159.5, flexShrink: 0,
        background: 'rgba(250, 250, 253, 0.85)',
        backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
        borderRight: '1px solid #d5d5d5',
        display: 'flex', flexDirection: 'column', height: '100%',
        userSelect: 'none',
      }}>
        {}
        <div
          onMouseDown={ctx?.onTitleBarMouseDown}
          style={{
            height: 52,
            display: 'flex', alignItems: 'center',
            paddingLeft: 16,
            flexShrink: 0,
            cursor: 'grab',
          }}
        >
          {ctx && (
            <TrafficLights onClose={ctx.onClose} onMinimize={ctx.onMinimize} />
          )}
        </div>

        {}
        <div style={{ flex: 1, overflowY: 'auto', paddingTop: 6, paddingBottom: 10 }}>
          {}
          <div style={{
            padding: '4px 8px 5px 12px',
            fontSize: 11, fontWeight: 600, color: '#8a8a8e',
            letterSpacing: '0.5px', textTransform: 'none',
          }}>
            Favourites
          </div>

          {SIDEBAR_SECTIONS.map(sec => {
            const isActive = active === sec.id
            return (
              <div
                key={sec.id}
                onClick={() => setActive(sec.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 8px', margin: '0px 6px', borderRadius: 6,
                  cursor: 'default', fontSize: 13, fontWeight: 400,
                  color: isActive ? '#000' : '#1c1c1e',
                  background: isActive ? 'rgba(0,0,0,0.12)' : 'transparent',
                  transition: 'background 80ms',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.06)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <PortfolioIcon type={sec.icon} active={isActive} />
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sec.id}</span>
              </div>
            )
          })}

          {}
          <div style={{
            padding: '12px 8px 5px 12px',
            fontSize: 11, fontWeight: 600, color: '#8a8a8e',
            letterSpacing: '0.5px', textTransform: 'none',
          }}>
            Tags
          </div>
          {[
            { id: 'Red', dot: '#ff3b30' },
            { id: 'Orange', dot: '#ff9500' },
            { id: 'Yellow', dot: '#ffcc00' },
            { id: 'Green', dot: '#34c759' },
            { id: 'Blue', dot: '#007aff' },
            { id: 'Purple', dot: '#af52de' },
          ].map(item => (
            <div
              key={item.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 8px', margin: '0px 6px', borderRadius: 6,
                cursor: 'default', fontSize: 13,
                color: '#1c1c1e', background: 'transparent',
                transition: 'background 80ms',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.dot, flexShrink: 0, display: 'inline-block', marginLeft: 3 }} />
              <span>{item.id}</span>
            </div>
          ))}
        </div>
      </div>

      {}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, background: '#fff' }}>

        {}
        <div
          onMouseDown={ctx?.onTitleBarMouseDown}
          style={{
            height: 52,
            background: '#ffffff',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center',
            padding: '0 16px',
            flexShrink: 0,
            cursor: 'grab',
            userSelect: 'none',
            gap: 16, 
          }}
        >
          {}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 1, minWidth: 0 }}>
            {}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <NavBtn opacity={canGoBack ? 1 : 0.25} onClick={canGoBack ? handleBack : undefined}>
                <svg viewBox="0 0 16 16" fill="none" stroke="black" strokeOpacity={0.85} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 24, flexShrink: 0 }}>
                  <path d="M10 2L4 8l6 6" />
                </svg>
              </NavBtn>
              <NavBtn opacity={0.25}>
                <svg viewBox="0 0 16 16" fill="none" stroke="black" strokeOpacity={0.85} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 24, flexShrink: 0 }}>
                  <path d="M6 2l6 6-6 6" />
                </svg>
              </NavBtn>
            </div>

            {}
            <span style={{
              fontSize: 15, fontWeight: 700, color: '#1c1c1e',
              pointerEvents: 'none', whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis'
            }}>
              {getCurrentDisplayName()}
            </span>
          </div>

          <div style={{ flex: 1 }} /> {}

          {}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexShrink: 0 }}>
            {}
            <ViewOptionsBtn>
              <svg viewBox="0 0 46.2891 45.918" style={{ width: 17, height: 17, flexShrink: 0 }}>
                <g>
                  <rect height="45.918" opacity="0" width="46.2891" x="0" y="0" />
                  <path d="M29.5898 45.918L41.4258 45.918C44.3945 45.918 45.918 44.4531 45.918 41.3477L45.918 29.668C45.918 26.5625 44.3945 25.0977 41.4258 25.0977L29.5898 25.0977C26.6016 25.0977 25.0977 26.5625 25.0977 29.668L25.0977 41.3477C25.0977 44.4531 26.6016 45.918 29.5898 45.918ZM29.6484 42.8516C28.6133 42.8516 28.1641 42.3828 28.1641 41.3477L28.1641 29.6875C28.1641 28.6523 28.6133 28.1641 29.6484 28.1641L41.3867 28.1641C42.3828 28.1641 42.8516 28.6523 42.8516 29.6875L42.8516 41.3477C42.8516 42.3828 42.3828 42.8516 41.3867 42.8516Z" fill="black" fillOpacity={0.85} />
                  <path d="M4.49219 45.918L16.3281 45.918C19.2969 45.918 20.8203 44.4531 20.8203 41.3477L20.8203 29.668C20.8203 26.5625 19.2969 25.0977 16.3281 25.0977L4.49219 25.0977C1.52344 25.0977 0 26.5625 0 29.668L0 41.3477C0 44.4531 1.52344 45.918 4.49219 45.918ZM4.53125 42.8516C3.53516 42.8516 3.06641 42.3828 3.06641 41.3477L3.06641 29.6875C3.06641 28.6523 3.53516 28.1641 4.53125 28.1641L16.2695 28.1641C17.2656 28.1641 17.7539 28.6523 17.7539 29.6875L17.7539 41.3477C17.7539 42.3828 17.2656 42.8516 16.2695 42.8516Z" fill="black" fillOpacity={0.85} />
                  <path d="M29.5898 20.8203L41.4258 20.8203C44.3945 20.8203 45.918 19.375 45.918 16.25L45.918 4.57031C45.918 1.46484 44.3945 0 41.4258 0L29.5898 0C26.6016 0 25.0977 1.46484 25.0977 4.57031L25.0977 16.25C25.0977 19.375 26.6016 20.8203 29.5898 20.8203ZM29.6484 17.7539C28.6133 17.7539 28.1641 17.2852 28.1641 16.2305L28.1641 4.57031C28.1641 3.55469 28.6133 3.06641 29.6484 3.06641L41.3867 3.06641C42.3828 3.06641 42.8516 3.55469 42.8516 4.57031L42.8516 16.2305C42.8516 17.2852 42.3828 17.7539 41.3867 17.7539Z" fill="black" fillOpacity={0.85} />
                  <path d="M4.49219 20.8203L16.3281 20.8203C19.2969 20.8203 20.8203 19.375 20.8203 16.25L20.8203 4.57031C20.8203 1.46484 19.2969 0 16.3281 0L4.49219 0C1.52344 0 0 1.46484 0 4.57031L0 16.25C0 19.375 1.52344 20.8203 4.49219 20.8203ZM4.53125 17.7539C3.53516 17.7539 3.06641 17.2852 3.06641 16.2305L3.06641 4.57031C3.06641 3.55469 3.53516 3.06641 4.53125 3.06641L16.2695 3.06641C17.2656 3.06641 17.7539 3.55469 17.7539 4.57031L17.7539 16.2305C17.7539 17.2852 17.2656 17.7539 16.2695 17.7539Z" fill="black" fillOpacity={0.85} />
                </g>
              </svg>
              <svg viewBox="0 0 33.8477 48.1055" style={{ width: 10, height: 13, flexShrink: 0 }}>
                <g>
                  <rect height="48.1055" opacity="0" width="33.8477" x="0" y="0" />
                  <path d="M16.7383 0C16.1719 0 15.6641 0.253906 15.2344 0.683594L0.566406 14.7852C0.214844 15.1367 0 15.5859 0 16.2109C0 17.3047 0.839844 18.1445 1.95312 18.1445C2.40234 18.1445 2.91016 18.0078 3.37891 17.5586L16.7383 4.47266L30.0977 17.5586C30.5664 17.9883 31.0742 18.1445 31.5234 18.1445C32.6367 18.1445 33.4766 17.3047 33.4766 16.2109C33.4766 15.5859 33.2422 15.1367 32.9102 14.7852L18.2422 0.683594C17.8125 0.253906 17.3047 0 16.7383 0ZM16.7383 48.0664C17.3047 48.0664 17.8125 47.832 18.2422 47.4023L32.9102 33.2812C33.2422 32.9297 33.4766 32.4805 33.4766 31.875C33.4766 30.7617 32.6367 29.9414 31.5234 29.9414C31.0742 29.9414 30.5664 30.0781 30.0977 30.5078L16.7383 43.5938L3.37891 30.5078C2.91016 30.0586 2.40234 29.9414 1.95312 29.9414C0.839844 29.9414 0 30.7617 0 31.875C0 32.4805 0.214844 32.9297 0.566406 33.2812L15.2344 47.4023C15.6641 47.832 16.1719 48.0664 16.7383 48.0664Z" fill="black" fillOpacity={0.85} />
                </g>
              </svg>
            </ViewOptionsBtn>

            {}
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
              {}
              <TbBtn title="Share">
                <svg viewBox="0 0 44.5508 68.3398" style={{ width: 16, height: 24, flexShrink: 0 }}>
                  <path d="M44.1797 30.1953L44.1797 49.4727C44.1797 56.1523 40.4688 59.8828 33.7695 59.8828L10.4102 59.8828C3.71094 59.8828 0 56.1523 0 49.4727L0 30.1953C0 23.5156 3.71094 19.8047 10.4102 19.8047L15.9766 19.8047L15.9766 23.2617L10.3906 23.2617C5.95703 23.2617 3.45703 25.7617 3.45703 30.1953L3.45703 49.4922C3.45703 53.9258 5.95703 56.4258 10.3906 56.4258L33.7695 56.4258C38.2227 56.4258 40.7227 53.9258 40.7227 49.4922L40.7227 30.1953C40.7227 25.7617 38.2227 23.2617 33.7695 23.2617L28.2031 23.2617L28.2031 19.8047L33.7695 19.8047C40.4688 19.8047 44.1797 23.5156 44.1797 30.1953Z" fill="black" fillOpacity={0.85} />
                  <path d="M13.5156 15.3711C13.9258 15.3711 14.3945 15.1953 14.707 14.8438L18.9648 10.3906L22.0898 7.10938L25.2148 10.3906L29.4531 14.8438C29.7656 15.1953 30.2148 15.3711 30.625 15.3711C31.5234 15.3711 32.207 14.7266 32.207 13.8477C32.207 13.3984 32.0117 13.0469 31.6992 12.7148L23.3398 4.58984C22.9102 4.16016 22.5195 4.02344 22.0898 4.02344C21.6602 4.02344 21.2695 4.16016 20.8398 4.58984L12.4805 12.7148C12.1484 13.0469 11.9727 13.3984 11.9727 13.8477C11.9727 14.7266 12.6172 15.3711 13.5156 15.3711ZM22.0898 40.3711C23.0078 40.3711 23.8086 39.6094 23.8086 38.7109L23.8086 12.5L23.5547 6.25C23.5156 5.44922 22.8906 4.78516 22.0898 4.78516C21.2891 4.78516 20.6641 5.44922 20.625 6.25L20.3711 12.5L20.3711 38.7109C20.3711 39.6094 21.1719 40.3711 22.0898 40.3711Z" fill="black" fillOpacity={0.85} />
                </svg>
              </TbBtn>

              {}
              <TbBtn title="Tags">
                <svg viewBox="0 0 56.2451 58.6084" style={{ width: 19, height: 19, flexShrink: 0 }}>
                  <path d="M29.2749 55.9741L53.9429 31.2476C55.7398 29.4702 55.8765 28.5132 55.8765 25.8569L55.8765 16.2671C55.8765 13.728 55.3296 12.9663 53.4155 11.0718L47.5757 5.21241C45.6616 3.29834 44.8999 2.771 42.3608 2.771L32.7905 2.771C30.1148 2.771 29.1773 2.90772 27.3804 4.68506L2.63428 29.353C-0.861811 32.8296-0.900874 36.4624 2.65381 39.978L18.6499 55.9546C22.2046 59.5093 25.7983 59.4702 29.2749 55.9741ZM26.9312 53.396C24.9976 55.3491 22.9468 55.3687 20.9546 53.3765L5.23194 37.6538C3.23975 35.6616 3.27881 33.5913 5.21241 31.6773L29.8218 7.12647C30.4077 6.56006 31.0132 6.22803 31.9116 6.22803L42.5366 6.22803C43.3765 6.22803 43.9819 6.54053 44.5874 7.12647L51.5015 14.0405C52.1069 14.646 52.3999 15.2515 52.3999 16.1108L52.3999 26.7163C52.3999 27.6343 52.0874 28.2398 51.5015 28.8062ZM39.4898 22.3608C41.3062 22.3608 42.6929 20.9546 42.6929 19.1577C42.6929 17.3608 41.3062 15.9546 39.4898 15.9546C37.6538 15.9546 36.2671 17.3608 36.2671 19.1577C36.2671 20.9546 37.6538 22.3608 39.4898 22.3608Z" fill="black" fillOpacity={0.85} />
                </svg>
              </TbBtn>

              {}
              <MoreOptionsBtn>
                <svg viewBox="0 0 16 16" fill="none" stroke="black" strokeOpacity={0.85} strokeWidth={1.0} style={{ width: 19, height: 19, flexShrink: 0 }}>
                  <circle cx="8" cy="8" r="6.5" />
                  <circle cx="4.5" cy="8" r="1.0" fill="black" fillOpacity={0.85} stroke="none" />
                  <circle cx="8" cy="8" r="1.0" fill="black" fillOpacity={0.85} stroke="none" />
                  <circle cx="11.5" cy="8" r="1.0" fill="black" fillOpacity={0.85} stroke="none" />
                </svg>
                <svg viewBox="0 0 10 6" fill="none" stroke="black" strokeOpacity={0.85} strokeWidth={1.0} strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 6.5, flexShrink: 0 }}>
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </MoreOptionsBtn>
            </div>

            {}
            <motion.div
              initial={false}
              animate={{
                width: searchExpanded ? 120 : 24,
                background: searchExpanded ? 'rgba(0,0,0,0.06)' : 'transparent',
                borderColor: searchExpanded ? 'rgba(0,0,0,0.04)' : 'transparent',
                paddingLeft: searchExpanded ? 8 : 0,
                paddingRight: searchExpanded ? 8 : 0,
              }}
              transition={{
                type: 'spring',
                bounce: 0,
                duration: searchExpanded ? 0.3 : 0.15
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                border: '1px solid transparent',
                borderRadius: 6,
                height: 24, flexShrink: 1, minWidth: 24,
                cursor: searchExpanded ? 'text' : 'default',
                overflow: 'hidden'
              }}
              onClick={() => {
                if (!searchExpanded) {
                  setSearchExpanded(true)
                  setTimeout(() => searchInputRef.current?.focus(), 50)
                }
              }}
              onMouseEnter={e => { if (!searchExpanded) e.currentTarget.style.background = 'rgba(0,0,0,0.05)' }}
              onMouseLeave={e => { if (!searchExpanded) e.currentTarget.style.background = 'transparent' }}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="black" strokeOpacity={0.85} strokeWidth={1.0} style={{ width: searchExpanded ? 15.5 : 18.5, height: searchExpanded ? 15.5 : 18.5, flexShrink: 0, margin: searchExpanded ? 0 : 'auto' }}>
                <circle cx="6.5" cy="6.5" r="4.5" />
                <line x1="10.3" y1="10.3" x2="14" y2="14" strokeLinecap="round" />
              </svg>
              {searchExpanded && (
                <motion.input
                  ref={searchInputRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.1 } }}
                  type="text"
                  placeholder="Search"
                  onBlur={() => setSearchExpanded(false)}
                  style={{
                    background: 'none', border: 'none', outline: 'none',
                    fontSize: 12, color: '#1c1c1e', width: '100%', padding: 0,
                  }}
                />
              )}
            </motion.div>
          </div>
        </div>

        {}
        <div
          ref={constraintRef}
          style={{ flex: 1, position: 'relative', background: '#fff', overflow: 'auto' }}
          onClick={() => setSelectedMainIcons([])}
        >
          {active === 'About Me' ? (
            <AboutMeContent
              view={aboutMeView}
              setView={setAboutMeView}
              folders={aboutMeFolders}
              setFolders={setAboutMeFolders}
              itemPositions={itemPositions}
              setItemPositions={setItemPositions}
              savePosition={savePosition}
              savePositionsBatch={savePositionsBatch}
            />
          ) : active === 'Experience' ? (
            <ExperienceContent
              view={expView}
              setView={setExpView}
              constraintRef={constraintRef}
              itemPositions={itemPositions}
              savePosition={savePosition}
              savePositionsBatch={savePositionsBatch}
            />
          ) : active === 'Skills' ? (
            <SkillsContent
              view={skillsView}
              setView={setSkillsView}
              constraintRef={constraintRef}
              itemPositions={itemPositions}
              savePosition={savePosition}
              savePositionsBatch={savePositionsBatch}
            />
          ) : active === 'Projects' ? (
            <ProjectsContent
              view={projView}
              setView={setProjView}
              constraintRef={constraintRef}
              itemPositions={itemPositions}
              savePosition={savePosition}
              savePositionsBatch={savePositionsBatch}
            />
          ) : (
            <>
              {icons.map((item, i) => {
                const defaultPos = getInitialPos(i)
                const iconId = `main-icon-${active}-${item.id}`
                const pos = itemPositions[iconId] || defaultPos
                return (
                  <DraggableItem
                    key={iconId}
                    id={iconId}
                    x={pos.x}
                    y={pos.y}
                    label={item.label}
                    selected={selectedMainIcons.includes(iconId)}
                    onClick={(clickedId, e) => handleMainIconClick(iconId, e)}
                    onDragEnd={handleMainIconDragEnd}
                    onBatchDragEnd={handleMainBatchDragEnd}
                    enableMultiSelect={true}
                    containerRef={constraintRef}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6 }}>
                      {item.type === 'folder'
                        ? <FolderSVG color={item.color} />
                        : <DocSVG ext={item.ext} color={item.color} />
                      }
                    </div>
                  </DraggableItem>
                )
              })}
            </>
          )}
        </div>

        {}
        <div style={{
          height: 27, borderTop: '1px solid rgba(0,0,0,0.08)',
          background: '#fff',
          display: 'flex', alignItems: 'center',
          padding: '0 10px', fontSize: 11, color: '#555',
          flexShrink: 0, gap: 4,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          userSelect: 'none',
        }}>
          {getPathBreadcrumbs().map((item, index, arr) => (
            <React.Fragment key={index}>
              <img src={item.icon} alt="" style={{ width: 15.5, height: 13.5, objectFit: 'contain', marginRight: 1, flexShrink: 0 }} />
              <span style={{ fontWeight: item.isActive ? 600 : 400, color: item.isActive ? '#1c1c1e' : '#555' }}>
                {item.label}
              </span>
              {index < arr.length - 1 && (
                <span style={{ color: '#777', padding: '0 4px', fontSize: 13, fontWeight: 600, display: 'inline-block', transform: 'translateY(-1px)' }}>›</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}



export function getWindowContent(app) {
  if (app.startsWith('Notes_')) {
    const expId = app.split('_')[1]
    return <NotesContent expId={expId} />
  }
  if (app === 'Notes') {
    return <NotesContent expId={null} />
  }
  if (app.startsWith('Preview_')) {
    return <PreviewContent appId={app} />
  }

  switch (app) {
    case 'Finder': return <FinderContent />
    case 'Safari': return <SafariContent />
    case 'VS Code': return <VSCodeContent />
    case 'Photos': return <PhotosContent />
    case 'Spotify': return <SpotifyContent />
    case 'iMessage': return <IMessageContent />
    default: return <div style={{ padding: 24, color: '#86868b' }}>No content yet.</div>
  }
}
