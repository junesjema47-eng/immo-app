import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import supabase from '../../lib/supabaseClient'

type Inserat = {
  id: string
  created_at: string
  rolle: 'suche' | 'biete'
  ort: string
  budget: string
  immobilienart: string
  email?: string
  telefon?: string
  groesse?: string
  zimmer?: string
  beschreibung?: string
  bilder?: string[]
}

const parsePreis = (s?: string) => {
  if (!s) return 0
  return parseFloat(s.replace(/[^\d]/g, '')) || 0
}

const formatPreis = (s?: string) => {
  const n = parsePreis(s)
  if (!n) return s || '-'
  return n.toLocaleString('de-DE') + ' €'
}

export default function InseratDetail() {
  const router = useRouter()
  const { id } = router.query
  const [inserat, setInserat] = useState<Inserat | null>(null)
  const [laden, setLaden] = useState(true)
  const [fehler, setFehler] = useState<string | null>(null)
  const [aktuellesBild, setAktuellesBild] = useState(0)
  const [kopiert, setKopiert] = useState(false)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      const { data, error } = await supabase
        .from('inserate')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        setFehler('Inserat nicht gefunden')
      } else {
        setInserat(data as Inserat)
      }
      setLaden(false)
    }
    load()
  }, [id])

  const handleWhatsAppShare = () => {
    if (!inserat) return
    const zeilen = [
      `🏠 ${inserat.immobilienart} in ${inserat.ort}`,
      `${inserat.rolle === 'suche' ? '🔍 Gesucht' : '🏢 Geboten'}: ${formatPreis(inserat.budget)}`,
    ]
    if (inserat.groesse) zeilen.push(`📐 ${inserat.groesse} m²`)
    if (inserat.zimmer) zeilen.push(`🚪 ${inserat.zimmer} Zimmer`)
    zeilen.push('', `Hier ansehen: ${window.location.href}`)

    const text = zeilen.join('\n')
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setKopiert(true)
      setTimeout(() => setKopiert(false), 2000)
    } catch {
      alert('Link konnte nicht kopiert werden')
    }
  }

  if (laden) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={styles.info}>Lädt...</p>
        </div>
      </div>
    )
  }

  if (fehler || !inserat) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <header style={styles.header}>
            <Link href="/" style={styles.logo}>🏠 Immo-Plattform</Link>
            <Link href="/inserate" style={styles.backBtn}>← Alle Inserate</Link>
          </header>
          <div style={styles.errorCard}>
            <p style={styles.errorEmoji}>🤷</p>
            <p style={styles.errorText}>{fehler || 'Inserat nicht gefunden'}</p>
            <Link href="/inserate" style={styles.errorBtn}>Zurück zur Liste</Link>
          </div>
        </div>
      </div>
    )
  }

  const hatBilder = inserat.bilder && inserat.bilder.length > 0

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <Link href="/" style={styles.logo}>🏠 Immo-Plattform</Link>
          <Link href="/inserate" style={styles.backBtn}>← Alle Inserate</Link>
        </header>

        <div style={styles.layout}>
          {/* Bildergalerie */}
          <div style={styles.gallerySection}>
            {hatBilder ? (
              <>
                <div style={styles.mainImageWrapper}>
                  <img
                    src={inserat.bilder![aktuellesBild]}
                    style={styles.mainImage}
                    alt=""
                  />
                </div>
                {inserat.bilder!.length > 1 && (
                  <div style={styles.thumbnails}>
                    {inserat.bilder!.map((url, idx) => (
                      <button
                        key={url}
                        style={idx === aktuellesBild ? styles.thumbAktiv : styles.thumb}
                        onClick={() => setAktuellesBild(idx)}
                      >
                        <img src={url} style={styles.thumbImg} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={styles.platzhalter}>
                <span style={{ fontSize: 80 }}>🏠</span>
              </div>
            )}
          </div>

          {/* Info Sidebar */}
          <div style={styles.infoSection}>
            <div style={styles.infoCard}>
              <span
                style={inserat.rolle === 'suche' ? styles.badgeSuche : styles.badgeBiete}
              >
                {inserat.rolle === 'suche' ? '🔍 Gesucht' : '🏢 Geboten'}
              </span>
              <h1 style={styles.titel}>{inserat.immobilienart}</h1>
              <p style={styles.ort}>📍 {inserat.ort}</p>
              <p style={styles.preis}>
                <span style={styles.preisLabel}>
                  {inserat.rolle === 'suche' ? 'Budget:' : 'Preis:'}
                </span>{' '}
                <strong>{formatPreis(inserat.budget)}</strong>
              </p>

              {(inserat.groesse || inserat.zimmer) && (
                <div style={styles.metaGrid}>
                  {inserat.groesse && (
                    <div style={styles.metaBox}>
                      <p style={styles.metaLabel}>Größe</p>
                      <p style={styles.metaValue}>{inserat.groesse} m²</p>
                    </div>
                  )}
                  {inserat.zimmer && (
                    <div style={styles.metaBox}>
                      <p style={styles.metaLabel}>Zimmer</p>
                      <p style={styles.metaValue}>{inserat.zimmer}</p>
                    </div>
                  )}
                </div>
              )}

              {inserat.beschreibung && (
                <>
                  <h3 style={styles.h3}>Beschreibung</h3>
                  <p style={styles.beschreibung}>{inserat.beschreibung}</p>
                </>
              )}

              {/* Teilen-Bereich */}
              <div style={styles.teilenCard}>
                <h4 style={styles.h4}>Teilen</h4>
                <div style={styles.teilenButtons}>
                  <button style={styles.whatsappBtn} onClick={handleWhatsAppShare}>
                    💬 WhatsApp
                  </button>
                  <button style={styles.copyBtn} onClick={handleCopyLink}>
                    {kopiert ? '✅ Kopiert!' : '🔗 Link kopieren'}
                  </button>
                </div>
              </div>

              {/* Kontakt */}
              {(inserat.email || inserat.telefon) && (
                <div style={styles.kontaktCard}>
                  <h4 style={styles.h4}>Kontakt aufnehmen</h4>
                  {inserat.email && (
                    
                      href={`mailto:${inserat.email}?subject=Interesse%20an%20deinem%20Inserat&body=Hallo%2C%0A%0Aich%20habe%20dein%20Inserat%20auf%20der%20Immo-Plattform%20gesehen%20und%20h%C3%A4tte%20Interesse.`}
                      style={styles.emailBtn}
                    >
                      📧 E-Mail senden
                    </a>
                  )}
                  {inserat.telefon && (
                    <a href={`tel:${inserat.telefon}`} style={styles.telBtn}>
                      📞 Anrufen: {inserat.telefon}
                    </a>
                  )}
                </div>
              )}

              <p style={styles.datum}>
                Veröffentlicht am{' '}
                {new Date(inserat.created_at).toLocaleDateString('de-DE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', background: '#f0f2f5', fontFamily: 'system-ui, sans-serif', padding: '20px' },
  container: { maxWidth: 1200, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', marginBottom: 20 },
  logo: { fontSize: 20, fontWeight: 700, textDecoration: 'none', color: '#1a1a1a' },
  backBtn: { fontSize: 14, textDecoration: 'none', color: '#555' },
  info: { fontSize: 16, color: '#888', textAlign: 'center' as const, padding: 60 },
  errorCard: { background: '#fff', borderRadius: 16, padding: '60px 20px', textAlign: 'center' as const, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
  errorEmoji: { fontSize: 56, margin: 0 },
  errorText: { fontSize: 16, color: '#555', marginTop: 12, marginBottom: 20 },
  errorBtn: { padding: '12px 24px', borderRadius: 10, background: '#1a1a1a', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'inline-block' },
  layout: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 24 },
  gallerySection: { minWidth: 0 },
  mainImageWrapper: { width: '100%', aspectRatio: '4/3', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  mainImage: { width: '100%', height: '100%', objectFit: 'cover' },
  thumbnails: { display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' as const },
  thumb: { width: 80, height: 80, borderRadius: 10, overflow: 'hidden', border: '2px solid transparent', cursor: 'pointer', padding: 0, background: 'none' },
  thumbAktiv: { width: 80, height: 80, borderRadius: 10, overflow: 'hidden', border: '2px solid #1a1a1a', cursor: 'pointer', padding: 0, background: 'none' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  platzhalter: { width: '100%', aspectRatio: '4/3', borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  infoSection: { position: 'sticky', top: 20, alignSelf: 'start', minWidth: 0 },
  infoCard: { background: '#fff', borderRadius: 16, padding: '28px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  badgeSuche: { display: 'inline-block', fontSize: 13, fontWeight: 600, padding: '5px 12px', borderRadius: 20, background: '#f0fdf8', color: '#065f46', marginBottom: 12 },
  badgeBiete: { display: 'inline-block', fontSize: 13, fontWeight: 600, padding: '5px 12px', borderRadius: 20, background: '#fffbeb', color: '#78350f', marginBottom: 12 },
  titel: { fontSize: 26, fontWeight: 700, margin: 0, marginBottom: 8, color: '#1a1a1a' },
  ort: { fontSize: 15, color: '#555', margin: 0, marginBottom: 12 },
  preis: { fontSize: 22, margin: 0, marginBottom: 20, color: '#1a1a1a' },
  preisLabel: { fontSize: 14, color: '#888', fontWeight: 400 },
  metaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 },
  metaBox: { background: '#fafafa', borderRadius: 10, padding: 12 },
  metaLabel: { fontSize: 11, color: '#888', margin: 0, textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600 },
  metaValue: { fontSize: 18, color: '#1a1a1a', fontWeight: 700, margin: 0, marginTop: 4 },
  h3: { fontSize: 16, fontWeight: 700, margin: 0, marginTop: 4, marginBottom: 8, color: '#1a1a1a' },
  beschreibung: { fontSize: 14, color: '#444', lineHeight: 1.6, margin: 0, marginBottom: 20, whiteSpace: 'pre-wrap' as const },
  teilenCard: { background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 16 },
  h4: { fontSize: 14, fontWeight: 700, margin: 0, marginBottom: 10, color: '#1a1a1a' },
  teilenButtons: { display: 'flex', gap: 8, flexWrap: 'wrap' as const },
  whatsappBtn: { flex: 1, padding: '10px 14px', borderRadius: 10, border: 'none', background: '#25D366', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', minWidth: 120 },
  copyBtn: { flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', color: '#1a1a1a', fontSize: 14, fontWeight: 600, cursor: 'pointer', minWidth: 120 },
  kontaktCard: { background: '#fafafa', borderRadius: 12, padding: 16 },
  emailBtn: { display