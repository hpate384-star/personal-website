



import html2canvas from 'html2canvas'


export async function captureSnapshot(element) {
  if (!element) return null
  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 0.5,          
      logging: false,
      
      ignoreElements: (el) => el.classList?.contains('resize-handle'),
    })
    return canvas.toDataURL('image/png')
  } catch (err) {
    console.warn('[captureSnapshot] failed:', err)
    return null
  }
}
