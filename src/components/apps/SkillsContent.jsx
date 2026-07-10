import React from 'react'
import { WindowCtx } from '../Window'
import DraggableItem from '../DraggableItem'
import folderImg from '../../assets/finder.png'
import { getInitialPos } from '../WindowContent'

const devicons = {
  Python: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  Java: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
  'C++': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
  Javascript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  TypeScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
  SQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg',
  'React.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
  'Spring Boot': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg',
  FastAPI: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',
  OpenCV: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opencv/opencv-original.svg',
  NumPy: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg',
  Pandas: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg',
  PostgreSQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  MongoDB: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg',
  'Microsoft SQL Server': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg',
  Redis: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg',
  Docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
  Kubernetes: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg',
  Git: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  Jenkins: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg',
  Jira: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg',
  'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
}

function getSkillIcon(name) {
  if (devicons[name]) {
    return <img src={devicons[name]} alt={name} draggable={false} style={{ width: 42, height: 42, objectFit: 'contain', pointerEvents: 'none' }} />
  }
  if (name === 'LangChain') return <span style={{ fontSize: 36, pointerEvents: 'none' }}>🦜</span>
  if (name === 'MS Office') {
    return (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d83b01" strokeWidth="1.5" style={{ pointerEvents: 'none' }}>
        <rect x="3" y="3" width="18" height="18" rx="2" fill="#fff" />
        <path d="M7 7h10M7 12h10M7 17h6" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === 'UML') {
    return (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#007acc" strokeWidth="2" style={{ pointerEvents: 'none' }}>
        <rect x="2" y="3" width="7" height="6" rx="1" />
        <rect x="15" y="3" width="7" height="6" rx="1" />
        <rect x="8" y="15" width="8" height="6" rx="1" />
        <path d="M5.5 9v3h13V9M12 12v3" />
      </svg>
    )
  }
  if (name === 'CI/CD') {
    return (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2b579a" strokeWidth="2" style={{ pointerEvents: 'none' }}>
        <path d="M4 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6zm8 0c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z" strokeLinecap="round" />
      </svg>
    )
  }
  return <span style={{ fontSize: 32, pointerEvents: 'none' }}>📄</span>
}

export const SKILLS_DATA = {
  Languages: ['Python', 'Java', 'C++', 'Javascript', 'TypeScript', 'SQL'],
  'Frameworks & Libraries': ['React.js', 'Node.js', 'Spring Boot', 'FastAPI', 'LangChain', 'OpenCV', 'NumPy', 'Pandas'],
  Databases: ['PostgreSQL', 'MongoDB', 'Microsoft SQL Server', 'Redis'],
  'Tools & DevOps': ['Docker', 'Kubernetes', 'Git', 'Jenkins', 'Jira', 'AWS', 'MS Office', 'UML', 'CI/CD']
}

export function SkillsContent({ view, setView, constraintRef, itemPositions, savePosition, savePositionsBatch }) {
  const ctx = React.useContext(WindowCtx)
  const [selected, setSelected] = React.useState([])

  const [localPos, setLocalPos] = React.useState(() => {
    const pos = {}
    const categories = Object.keys(SKILLS_DATA)
    categories.forEach((cat, i) => {
      const key = `skill-cat-${cat}`
      pos[key] = itemPositions[key] || getInitialPos(i)
    })
    categories.forEach(cat => {
      SKILLS_DATA[cat].forEach((skill, i) => {
        const key = `skill-${skill}`
        pos[key] = itemPositions[key] || getInitialPos(i)
      })
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
    const categories = Object.keys(SKILLS_DATA)
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }} onClick={() => setSelected([])}>
        {categories.map((cat, i) => {
          const posKey = `skill-cat-${cat}`
          const pos = localPos[posKey] || getInitialPos(i)
          return (
            <DraggableItem
              key={cat}
              id={posKey}
              x={pos.x}
              y={pos.y}
              label={cat}
              img={folderImg.src}
              selected={selected.includes(posKey)}
              onClick={(clickedId, e) => handleItemClick(posKey, e)}
              onDoubleClick={(clickedId, e) => { e.stopPropagation(); setView(cat) }}
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

  const skills = SKILLS_DATA[view] || []
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} onClick={() => setSelected([])}>
      {skills.map((skill, i) => {
        const posKey = `skill-${skill}`
        const pos = localPos[posKey] || getInitialPos(i)
        return (
          <DraggableItem
             key={skill}
             id={posKey}
             x={pos.x}
             y={pos.y}
             label={skill}
             selected={selected.includes(posKey)}
             onClick={(clickedId, e) => handleItemClick(posKey, e)}
             onDoubleClick={(clickedId, e) => { e.stopPropagation(); }}
             onDragEnd={handleItemDragEnd}
             onBatchDragEnd={handleBatchDragEnd}
             enableMultiSelect={true}
             containerRef={constraintRef}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 52, height: 52 }}>
              {getSkillIcon(skill)}
            </div>
          </DraggableItem>
        )
      })}
    </div>
  )
}
