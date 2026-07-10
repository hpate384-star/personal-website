import '../index.css'
import { RightClickBlocker } from '../components/RightClickBlocker'

export const metadata = {
  title: 'Portfolio — macOS',
  description: 'Personal portfolio designed as a macOS desktop experience.',
}

export const viewport = {
  themeColor: '#1a5fb4',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#1a3a6b' }}>
        <RightClickBlocker />
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
