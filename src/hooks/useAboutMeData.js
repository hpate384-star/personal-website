import { useEffect, useState } from 'react'
import { supabase, getOrCreateSessionId } from '../lib/supabase'

export function useAboutMeData() {
  const [folders, setFolders] = useState([])
  const [itemPositions, setItemPositions] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function preload() {
      if (!supabase) {
        setIsLoaded(true)
        return
      }

      const sessionId = getOrCreateSessionId()
      const folderPromise = supabase
        .from('extracted_folders')
        .select('id, folder_name, folder_type, created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      const positionsPromise = supabase
        .from('item_positions')
        .select('item_id, x, y')
        .eq('session_id', sessionId)

      try {
        const [foldersResult, positionsResult] = await Promise.all([folderPromise, positionsPromise])

        if (!foldersResult.error && foldersResult.data?.length > 0) {
          setFolders(foldersResult.data)
        }

        if (!positionsResult.error && positionsResult.data?.length > 0) {
          const positions = {}
          positionsResult.data.forEach((item) => {
            positions[item.item_id] = { x: item.x, y: item.y }
          })
          setItemPositions(positions)
        }
      } catch (err) {
        console.error('[useAboutMeData] Failed to preload data:', err)
      } finally {
        setIsLoaded(true)
      }
    }

    preload()
  }, [])

  return {
    folders,
    setFolders,
    itemPositions,
    setItemPositions,
    isLoaded,
  }
}
