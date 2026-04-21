import type { AppProps } from 'next/app'
import Link from 'next/link'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <footer style={footerStyle}>
        <div style={footerInner}>
          <span style={footerText}>© 2026 Immo-Plattform</span>
          <div style={footerLinks}>
            <Link href="/impressum" style={footerLink}>Impressum</Link>
            <Link href="/datenschutz" style={footerLink}>Datenschutz</Link>
          </div>
        </div>
      </footer>
    </>
  )
}

const footerStyle = {
  background: '#f0f2f5',
  borderTop: '1px solid #e2e8f0',
  padding: '24px 20px',
  marginTop: 40,
  fontFamily: 'system-ui, sans-serif',
}

const footerInner = {
  maxWidth: 1200,
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap' as const,
  gap: 12,
}

const footerText = {
  fontSize: 13,
  color: '#888',
}

const footerLinks = {
  display: 'flex',
  gap: 20,
}

const footerLink = {
  fontSize: 13,
  color: '#555',
  textDecoration: 'none',
}