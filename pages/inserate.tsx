import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import supabase from '../lib/supabaseClient'

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

type FilterWert = 'alle' | 'suche' | 'biete'

export default function Inserate() {
  const [inserate, setInserate] = useState<Inserat[]>([])
  const [laden, setLaden] = useState(true)
  const [fehler, setFehler] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterWert>('alle')

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('inserate')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setFehler('Fehler beim Laden der Inserate.')
        console.error(error)
      } else {
        setInserate((data as Inserat[]) ?? [])
      }
      setLaden(false)
    }
    load()
  }, [])

  const anzahlSuche = inserate.filter((i) => i.rolle === 'suche').length
  const anzahlBiete = inserate.filter((i) => i.rolle === 'biete').length
  const gefiltert = inserate.filter((i) => filter === 'alle' ? true : i.rolle === filter)

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <Link href="/" style={styles.logo}>
            🏠 Immo-Plattform
          </Link>
          <Link href="/" style={styles.neuBtn}>
            + Neues Inserat
          </Link>
        </header>

        <h1 style={styles.h1}>Alle Inserate</h1>

        <div style={styles.filters}>
          <button
            style={filter === 'alle' ? styles.filterActive : styles.filter}
            onClick={() => setFilter('alle')}
          >
            Alle ({inserate.length})
          </button>
          <button
            style={filter === 'suche' ? styles.filterActive : styles.filter}
            onClick={() => setFilter('suche')}
          >
            🔍 Gesuche ({anzahlSuche})
          </button>
          <button
            style={filter === 'biete' ? styles.filterActive : styles.filter}
            onClick={() => setFilter('biete')}
          >
            🏢 Angebote ({anzahlBiete})
          </button>
        </div>

        {laden && <p style={styles.info}>Lade Inserate...</p>}
        {fehler && <p style={styles.fehlerText}>{fehler}</p>}
        {!laden && !fehler && gefiltert.length === 0 && (
          <p style={styles.info}>Noch keine Inserate in dieser Kategorie.</p>
        )}

        <div style={styles.grid}>
          {gefiltert.map((i) => (
            <div key={i.id} style={styles.card}>
              {i.bilder && i.bilder.length > 0 ? (
                <div style={styles.imageWrapper}>
                  <img src={i.bilder[0]} style={styles.cardImage} alt={i.immobilienart} />
                  {i.bilder.length > 1 && (
                    <span style={styles.imageCount}>+{i.bilder.length - 1}</span>
                  )}
                </div>
              ) : (
                <div style={styles.placeholderImage}>🏠</div>
              )}
              <div style={styles.cardContent}>
                <div style={i.rolle === 'suche' ? styles.badgeSuche : styles.badgeBiete}>
                  {i.rolle === 'suche' ? '🔍 Sucht' : '🏢 Bietet'}
                </div>
                <h3 style={styles.cardTitel}>{i.immobilienart}</h3>
                <p style={styles.cardOrt}>📍 {i.ort}</p>
                <p style={styles.cardBudget}>
                  {i.rolle === 'suche' ? 'Budget' : 'Preis'}: {i.budget} €
                </p>
                {(i.groesse || i.zimmer) && (
                  <p style={styles.cardMeta}>
                    {i.groesse && `${i.groesse} m²`}
                    {i.groesse && i.zimmer && ' · '}
                    {i.zimmer && `${i.zimmer} Zimmer`}
                  </p>
                )}
                {i.beschreibung && (
                  <p style={styles.cardBeschreibung}>{i.beschreibung}</p>
                )}
                <div style={styles.cardKontakt}>
                  <a href={`mailto:${i.email}`} style={styles.kontaktLink}>
                    📧 Kontaktieren
                  </a>
                  {i.telefon && (
                    <a href={`tel:${i.telefon}`} style={styles.kontaktLink}>
                      📞 {i.telefon}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 12,
  },
  logo: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1a1a1a',
    textDecoration: 'none',
  },
  neuBtn: {
    padding: '10px 18px',
    borderRadius: 10,
    background: '#1a1a1a',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
  },
  h1: {
    fontSize: 32,
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 24px 0',
  },
  filters: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  filter: {
    padding: '8px 16px',
    borderRadius: 20,
    border: '1.5px solid #e2e8f0',
    background: '#fff',
    color: '#555',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  filterActive: {
    padding: '8px 16px',
    borderRadius: 20,
    border: '1.5px solid #1a1a1a',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  info: {
    color: '#888',
    textAlign: 'center',
    padding: '40px 0',
  },
  fehlerText: {
    color: '#e53e3e',
    textAlign: 'center',
    padding: '40px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
  },
  card: {
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 180,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageCount: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: '4px 10px',
    borderRadius: 20,
    background: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
  },
  placeholderImage: {
    width: '100%',
    height: 180,
    background: '#f0f2f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 60,
  },
  cardContent: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  badgeSuche: {
    alignSelf: 'flex-start',
    padding: '4px 10px',
    borderRadius: 20,
    background: '#f0fdf8',
    color: '#065f46',
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
  },
  badgeBiete: {
    alignSelf: 'flex-start',
    padding: '4px 10px',
    borderRadius: 20,
    background: '#fffbeb',
    color: '#78350f',
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
  },
  cardTitel: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1a1a1a',
    margin: 0,
  },
  cardOrt: {
    fontSize: 14,
    color: '#555',
    margin: 0,
  },
  cardBudget: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1a1a1a',
    margin: '4px 0',
  },
  cardMeta: {
    fontSize: 13,
    color: '#666',
    margin: 0,
  },
  cardBeschreibung: {
    fontSize: 14,
    color: '#333',
    margin: '8px 0',
    lineHeight: 1.4,
  },
  cardKontakt: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTop: '1px solid #e2e8f0',
  },
  kontaktLink: {
    fontSize: 14,
    color: '#1a1a1a',
    textDecoration: 'none',
    fontWeight: 600,
  },
}