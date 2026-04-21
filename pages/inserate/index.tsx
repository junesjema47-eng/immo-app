import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
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

type RolleFilter = 'alle' | 'suche' | 'biete'
type Sortierung = 'neueste' | 'guenstigste' | 'teuerste' | 'groesste'

const IMMOBILIENARTEN = [
  'Eigentumswohnung',
  'Mehrfamilienhaus',
  'Einfamilienhaus',
  'Gewerbeimmobilie',
  'Grundstück',
  'Pflegeimmobilie',
  'Ferienimmobilie',
]

const parsePreis = (s?: string) => {
  if (!s) return 0
  return parseFloat(s.replace(/[^\d]/g, '')) || 0
}

const formatPreis = (s?: string) => {
  const n = parsePreis(s)
  if (!n) return s || '-'
  return n.toLocaleString('de-DE') + ' €'
}

export default function InserateListe() {
  const [inserate, setInserate] = useState<Inserat[]>([])
  const [laden, setLaden] = useState(true)

  const [suchtext, setSuchtext] = useState('')
  const [rolleFilter, setRolleFilter] = useState<RolleFilter>('alle')
  const [immobilienart, setImmobilienart] = useState('')
  const [preisMin, setPreisMin] = useState('')
  const [preisMax, setPreisMax] = useState('')
  const [sortierung, setSortierung] = useState<Sortierung>('neueste')

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('inserate')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setInserate(data as Inserat[])
      setLaden(false)
    }
    load()
  }, [])

  const gefiltert = inserate.filter((i) => {
    if (rolleFilter !== 'alle' && i.rolle !== rolleFilter) return false
    if (immobilienart && i.immobilienart !== immobilienart) return false

    if (suchtext) {
      const s = suchtext.toLowerCase()
      const match =
        i.ort?.toLowerCase().includes(s) ||
        i.beschreibung?.toLowerCase().includes(s) ||
        i.immobilienart?.toLowerCase().includes(s)
      if (!match) return false
    }

    const preis = parsePreis(i.budget)
    if (preisMin && preis < parsePreis(preisMin)) return false
    if (preisMax && preis > parsePreis(preisMax)) return false

    return true
  })

  const sortiert = [...gefiltert].sort((a, b) => {
    if (sortierung === 'neueste') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    if (sortierung === 'guenstigste') return parsePreis(a.budget) - parsePreis(b.budget)
    if (sortierung === 'teuerste') return parsePreis(b.budget) - parsePreis(a.budget)
    if (sortierung === 'groesste') {
      return (parseFloat(b.groesse || '0') || 0) - (parseFloat(a.groesse || '0') || 0)
    }
    return 0
  })

  const reset = () => {
    setSuchtext('')
    setRolleFilter('alle')
    setImmobilienart('')
    setPreisMin('')
    setPreisMax('')
    setSortierung('neueste')
  }

  const hatFilter =
    suchtext || rolleFilter !== 'alle' || immobilienart || preisMin || preisMax

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <Link href="/" style={styles.logo}>🏠 Immo-Plattform</Link>
          <Link href="/" style={styles.newBtn}>+ Neues Inserat</Link>
        </header>

        <h1 style={styles.titel}>Alle Inserate</h1>

        <div style={styles.filterCard}>
          <div style={styles.topRow}>
            <input
              style={styles.suche}
              placeholder="🔍 Suchen nach Ort, Beschreibung..."
              value={suchtext}
              onChange={(e) => setSuchtext(e.target.value)}
            />
            <select
              style={styles.sortierung}
              value={sortierung}
              onChange={(e) => setSortierung(e.target.value as Sortierung)}
            >
              <option value="neueste">Neueste zuerst</option>
              <option value="guenstigste">Günstigste zuerst</option>
              <option value="teuerste">Teuerste zuerst</option>
              <option value="groesste">Größte zuerst</option>
            </select>
          </div>

          <div style={styles.toggleReihe}>
            <button
              style={rolleFilter === 'alle' ? styles.toggleAktiv : styles.toggle}
              onClick={() => setRolleFilter('alle')}
            >
              Alle
            </button>
            <button
              style={rolleFilter === 'suche' ? styles.toggleAktiv : styles.toggle}
              onClick={() => setRolleFilter('suche')}
            >
              🔍 Gesuche
            </button>
            <button
              style={rolleFilter === 'biete' ? styles.toggleAktiv : styles.toggle}
              onClick={() => setRolleFilter('biete')}
            >
              🏢 Angebote
            </button>
          </div>

          <div style={styles.filterReihe}>
            <select
              style={styles.filterInput}
              value={immobilienart}
              onChange={(e) => setImmobilienart(e.target.value)}
            >
              <option value="">Alle Arten</option>
              {IMMOBILIENARTEN.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <input
              style={styles.filterInput}
              placeholder="Preis min (€)"
              value={preisMin}
              onChange={(e) => setPreisMin(e.target.value.replace(/[^\d]/g, ''))}
            />
            <input
              style={styles.filterInput}
              placeholder="Preis max (€)"
              value={preisMax}
              onChange={(e) => setPreisMax(e.target.value.replace(/[^\d]/g, ''))}
            />
            {hatFilter && (
              <button style={styles.resetBtn} onClick={reset}>
                ✕ Zurücksetzen
              </button>
            )}
          </div>
        </div>

        <p style={styles.counter}>
          {laden
            ? 'Lädt...'
            : sortiert.length === 0
            ? 'Keine Inserate gefunden'
            : `${sortiert.length} ${sortiert.length === 1 ? 'Inserat' : 'Inserate'} gefunden`}
        </p>

        {!laden && sortiert.length === 0 && (
          <div style={styles.leerZustand}>
            <p style={styles.leerEmoji}>🤷</p>
            <p style={styles.leerText}>
              Keine Inserate passen zu deinen Filtern.
            </p>
            {hatFilter && (
              <button style={styles.leerBtn} onClick={reset}>
                Filter zurücksetzen
              </button>
            )}
          </div>
        )}

        {sortiert.length > 0 && (
          <div style={styles.grid}>
            {sortiert.map((i) => (
              <Link
                key={i.id}
                href={`/inserate/${i.id}`}
                style={styles.kartenLink}
              >
                <div style={styles.karte}>
                  {i.bilder && i.bilder.length > 0 ? (
                    <div style={styles.bildWrapper}>
                      <img src={i.bilder[0]} alt="" style={styles.bild} />
                      {i.bilder.length > 1 && (
                        <span style={styles.bildBadge}>+{i.bilder.length - 1}</span>
                      )}
                    </div>
                  ) : (
                    <div style={styles.bildPlatzhalter}>🏠</div>
                  )}

                  <div style={styles.info}>
                    <span
                      style={i.rolle === 'suche' ? styles.badgeSuche : styles.badgeBiete}
                    >
                      {i.rolle === 'suche' ? '🔍 Gesucht' : '🏢 Geboten'}
                    </span>

                    <h3 style={styles.kartenTitel}>{i.immobilienart}</h3>
                    <p style={styles.kartenOrt}>📍 {i.ort}</p>
                    <p style={styles.kartenPreis}>{formatPreis(i.budget)}</p>

                    {(i.groesse || i.zimmer) && (
                      <p style={styles.kartenMeta}>
                        {i.groesse && `${i.groesse} m²`}
                        {i.groesse && i.zimmer && ' · '}
                        {i.zimmer && `${i.zimmer} Zi.`}
                      </p>
                    )}

                    <p style={styles.mehr}>Mehr anzeigen →</p>
                  </div>
                </div>
              </Link>
            ))}
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
    padding: '20px',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
  },
  logo: {
    fontSize: 20,
    fontWeight: 700,
    textDecoration: 'none',
    color: '#1a1a1a',
  },
  newBtn: {
    padding: '10px 18px',
    background: '#1a1a1a',
    color: '#fff',
    borderRadius: 10,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600,
  },
  titel: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 20,
    color: '#1a1a1a',
  },
  filterCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  topRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 14,
    flexWrap: 'wrap' as const,
  },
  suche: {
    flex: '1 1 300px',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1.5px solid #e2e8f0',
    fontSize: 15,
    outline: 'none',
    color: '#1a1a1a',
    background: '#fafafa',
  },
  sortierung: {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1.5px solid #e2e8f0',
    fontSize: 14,
    outline: 'none',
    color: '#1a1a1a',
    background: '#fff',
    cursor: 'pointer',
  },
  toggleReihe: {
    display: 'flex',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap' as const,
  },
  toggle: {
    padding: '8px 14px',
    borderRadius: 8,
    border: '1.5px solid #e2e8f0',
    background: '#fff',
    color: '#555',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  toggleAktiv: {
    padding: '8px 14px',
    borderRadius: 8,
    border: '1.5px solid #1a1a1a',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  filterReihe: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  },
  filterInput: {
    flex: '1 1 150px',
    padding: '10px 12px',
    borderRadius: 10,
    border: '1.5px solid #e2e8f0',
    fontSize: 14,
    outline: 'none',
    color: '#1a1a1a',
    background: '#fafafa',
  },
  resetBtn: {
    padding: '10px 14px',
    borderRadius: 10,
    border: '1.5px solid #fecaca',
    background: '#fef2f2',
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  counter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  leerZustand: {
    background: '#fff',
    borderRadius: 16,
    padding: '60px 20px',
    textAlign: 'center' as const,
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  leerEmoji: {
    fontSize: 56,
    margin: 0,
  },
  leerText: {
    fontSize: 16,
    color: '#555',
    marginTop: 12,
    marginBottom: 20,
  },
  leerBtn: {
    padding: '12px 24px',
    borderRadius: 10,
    border: 'none',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20,
  },
  kartenLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  karte: {
    background: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  bildWrapper: {
    position: 'relative',
    width: '100%',
    height: 180,
    background: '#f0f2f5',
    overflow: 'hidden',
  },
  bild: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  bildBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    background: 'rgba(0,0,0,0.7)',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  bildPlatzhalter: {
    width: '100%',
    height: 180,
    background: '#f0f2f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
  },
  info: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  badgeSuche: {
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 20,
    background: '#f0fdf8',
    color: '#065f46',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  badgeBiete: {
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 20,
    background: '#fffbeb',
    color: '#78350f',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  kartenTitel: {
    fontSize: 17,
    fontWeight: 700,
    margin: 0,
    marginBottom: 4,
    color: '#1a1a1a',
  },
  kartenOrt: {
    fontSize: 14,
    color: '#555',
    margin: 0,
    marginBottom: 8,
  },
  kartenPreis: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1a1a1a',
    margin: 0,
    marginBottom: 4,
  },
  kartenMeta: {
    fontSize: 13,
    color: '#888',
    margin: 0,
    marginBottom: 10,
  },
  mehr: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: 600,
    margin: 0,
    marginTop: 'auto',
  },
}