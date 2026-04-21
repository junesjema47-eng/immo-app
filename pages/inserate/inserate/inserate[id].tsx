import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import supabase from '../../lib/supabaseClient'

type Inserat = {
  id: number
  created_at: string
  rolle: 'suche' | 'biete'
  ort: string
  budget: string
  immobilienart: string
  email: string
  telefon: string | null
  groesse: string | null
  zimmer: string | null
  beschreibung: string | null
  bilder: string[] | null
}

export default function InseratDetail() {
  const router = useRouter()
  const { id } = router.query
  const [inserat, setInserat] = useState<Inserat | null>(null)
  const [laden, setLaden] = useState(true)
  const [fehler, setFehler] = useState<string | null>(null)
  const [aktuellesBild, setAktuellesBild] = useState(0)

  useEffect(() => {
    if (!id) return
    async function load() {
      const { data, error } = await supabase
        .from('inserate')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setFehler('Inserat nicht gefunden.')
        console.error(error)
      } else {
        setInserat(data as Inserat)
      }
      setLaden(false)
    }
    load()
  }, [id])

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <Link href="/" style={styles.logo}>🏠 Immo-Plattform</Link>
          <Link href="/inserate" style={styles.backBtn}>← Alle Inserate</Link>
        </header>

        {laden && <p style={styles.info}>Lade...</p>}
        {fehler && <p style={styles.fehlerText}>{fehler}</p>}

        {inserat && (
          <div style={styles.layout}>
            <div style={styles.gallerySection}>
              {inserat.bilder && inserat.bilder.length > 0 ? (
                <>
                  <div style={styles.mainImageWrapper}>
                    <img src={inserat.bilder[aktuellesBild]} style={styles.mainImage} alt="" />
                  </div>
                  {inserat.bilder.length > 1 && (
                    <div style={styles.thumbnails}>
                      {inserat.bilder.map((url, idx) => (
                        <button
                          key={url}
                          onClick={() => setAktuellesBild(idx)}
                          style={idx === aktuellesBild ? styles.thumbActive : styles.thumb}
                        >
                          <img src={url} style={styles.thumbImg} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={styles.placeholder}>🏠</div>
              )}
            </div>

            <div style={styles.infoSection}>
              <div style={inserat.rolle === 'suche' ? styles.badgeSuche : styles.badgeBiete}>
                {inserat.rolle === 'suche' ? '🔍 Gesucht' : '🏢 Geboten'}
              </div>
              <h1 style={styles.titel}>{inserat.immobilienart}</h1>
              <p style={styles.ort}>📍 {inserat.ort}</p>
              <p style={styles.preis}>
                {inserat.rolle === 'suche' ? 'Budget' : 'Preis'}: <strong>{inserat.budget} €</strong>
              </p>

              {(inserat.groesse || inserat.zimmer) && (
                <div style={styles.metaRow}>
                  {inserat.groesse && (
                    <div style={styles.metaBox}>
                      <span style={styles.metaLabel}>Größe</span>
                      <span style={styles.metaValue}>{inserat.groesse} m²</span>
                    </div>
                  )}
                  {inserat.zimmer && (
                    <div style={styles.metaBox}>
                      <span style={styles.metaLabel}>Zimmer</span>
                      <span style={styles.metaValue}>{inserat.zimmer}</span>
                    </div>
                  )}
                </div>
              )}

              {inserat.beschreibung && (
                <div style={styles.beschreibungSection}>
                  <h3 style={styles.sectionTitel}>
                    {inserat.rolle === 'suche' ? 'Wünsche' : 'Beschreibung'}
                  </h3>
                  <p style={styles.beschreibungText}>{inserat.beschreibung}</p>
                </div>
              )}

              <div style={styles.kontaktCard}>
                <h3 style={styles.sectionTitel}>Kontakt aufnehmen</h3>
                <a href={`mailto:${inserat.email}`} style={styles.kontaktBtnPrimary}>
                  📧 E-Mail senden
                </a>
                {inserat.telefon && (
                  <a href={`tel:${inserat.telefon}`} style={styles.kontaktBtnSecondary}>
                    📞 {inserat.telefon}
                  </a>
                )}
              </div>

              <p style={styles.datum}>
                Veröffentlicht am {new Date(inserat.created_at).toLocaleDateString('de-DE', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f0f2f5',
    fontFamily: 'system-ui, sans-serif',
    padding: '24px 16px',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  logo: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1a1a1a',
    textDecoration: 'none',
  },
  backBtn: {
    fontSize: 14,
    color: '#666',
    textDecoration: 'none',
    fontWeight: 600,
  },
  info: {
    color: '#888',
    textAlign: 'center',
    padding: '60px 0',
  },
  fehlerText: {
    color: '#e53e3e',
    textAlign: 'center',
    padding: '60px 0',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
    gap: 24,
    alignItems: 'start',
  },
  gallerySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  mainImageWrapper: {
    width: '100%',
    aspectRatio: '4 / 3',
    background: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbnails: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  thumb: {
    width: 70,
    height: 70,
    padding: 0,
    border: '2px solid transparent',
    borderRadius: 8,
    cursor: 'pointer',
    overflow: 'hidden',
    background: 'none',
  },
  thumbActive: {
    width: 70,
    height: 70,
    padding: 0,
    border: '2px solid #1a1a1a',
    borderRadius: 8,
    cursor: 'pointer',
    overflow: 'hidden',
    background: 'none',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  placeholder: {
    width: '100%',
    aspectRatio: '4 / 3',
    background: '#fff',
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  infoSection: {
    background: '#fff',
    borderRadius: 14,
    padding: 28,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: 24,
  },
  badgeSuche: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: 20,
    background: '#f0fdf8',
    color: '#065f46',
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 12,
  },
  badgeBiete: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: 20,
    background: '#fffbeb',
    color: '#78350f',
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 12,
  },
  titel: {
    fontSize: 26,
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 8px 0',
  },
  ort: {
    fontSize: 15,
    color: '#555',
    margin: '0 0 16px 0',
  },
  preis: {
    fontSize: 18,
    color: '#1a1a1a',
    margin: '0 0 20px 0',
  },
  metaRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 20,
  },
  metaBox: {
    flex: 1,
    padding: '12px 14px',
    borderRadius: 10,
    background: '#f7f8fa',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  metaLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  metaValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: 700,
  },
  beschreibungSection: {
    marginBottom: 24,
  },
  sectionTitel: {
    fontSize: 15,
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 8px 0',
  },
  beschreibungText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 1.5,
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  kontaktCard: {
    padding: 16,
    background: '#f7f8fa',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  kontaktBtnPrimary: {
    padding: '12px 16px',
    borderRadius: 10,
    background: '#1a1a1a',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    textAlign: 'center',
    textDecoration: 'none',
  },
  kontaktBtnSecondary: {
    padding: '12px 16px',
    borderRadius: 10,
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    color: '#1a1a1a',
    fontSize: 15,
    fontWeight: 600,
    textAlign: 'center',
    textDecoration: 'none',
  },
  datum: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
}