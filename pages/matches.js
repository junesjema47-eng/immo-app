import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'
import Link from 'next/link'

export default function Matches() {
  const [inserate, setInserate] = useState([])
  const [laden, setLaden] = useState(true)
  const [filter, setFilter] = useState('alle')

  useEffect(() => {
    ladeInserate()
  }, [])

  const ladeInserate = async () => {
    setLaden(true)
    const { data, error } = await supabase
      .from('inserate')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setInserate(data)
    setLaden(false)
  }

  const gefiltert = inserate.filter((i) => {
    if (filter === 'alle') return true
    return i.rolle === filter
  })

  const sucher = inserate.filter((i) => i.rolle === 'suche').length
  const anbieter = inserate.filter((i) => i.rolle === 'biete').length

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.titel}>📋 Alle Inserate</h1>
          <Link href="/" style={styles.linkBtn}>+ Neues Inserat</Link>
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.statBox}>
            <span style={styles.statZahl}>{sucher}</span>
            <span style={styles.statLabel}>🔍 Suchen</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statZahl}>{anbieter}</span>
            <span style={styles.statLabel}>🏢 Angebote</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statZahl}>{inserate.length}</span>
            <span style={styles.statLabel}>📊 Gesamt</span>
          </div>
        </div>

        {/* Filter */}
        <div style={styles.filterReihe}>
          {['alle', 'suche', 'biete'].map((f) => (
            <button
              key={f}
              style={filter === f ? styles.filterAktiv : styles.filterBtn}
              onClick={() => setFilter(f)}
            >
              {f === 'alle' ? 'Alle' : f === 'suche' ? '🔍 Suche' : '🏢 Angebote'}
            </button>
          ))}
        </div>

        {/* Liste */}
        {laden ? (
          <p style={styles.hinweis}>Lädt...</p>
        ) : gefiltert.length === 0 ? (
          <p style={styles.hinweis}>Noch keine Einträge vorhanden.</p>
        ) : (
          <div style={styles.grid}>
            {gefiltert.map((inserat) => (
              <div
                key={inserat.id}
                style={inserat.rolle === 'suche' ? styles.cardSuche : styles.cardBiete}
              >
                <div style={styles.cardHeader}>
                  <span style={inserat.rolle === 'suche' ? styles.badgeSuche : styles.badgeBiete}>
                    {inserat.rolle === 'suche' ? '🔍 Sucht' : '🏢 Bietet'}
                  </span>
                  <span style={styles.datum}>
                    {new Date(inserat.created_at).toLocaleDateString('de-DE')}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.zeile}>
                    <span style={styles.icon}>📍</span>
                    <span style={styles.wert}>{inserat.ort}</span>
                  </div>
                  <div style={styles.zeile}>
                    <span style={styles.icon}>💶</span>
                    <span style={styles.wert}>{inserat.budget} €</span>
                  </div>
                  <div style={styles.zeile}>
                    <span style={styles.icon}>🏠</span>
                    <span style={styles.wert}>{inserat.immobilienart}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0f2f5',
    fontFamily: 'system-ui, sans-serif',
    padding: '32px 20px',
  },
  container: {
    maxWidth: 760,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  titel: {
    fontSize: 26,
    fontWeight: 700,
    margin: 0,
  },
  linkBtn: {
    padding: '10px 18px',
    background: '#1a1a1a',
    color: '#fff',
    borderRadius: 10,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    background: '#fff',
    borderRadius: 12,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  statZahl: {
    fontSize: 28,
    fontWeight: 700,
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
  },
  filterReihe: {
    display: 'flex',
    gap: 8,
    marginBottom: 20,
  },
  filterBtn: {
    padding: '8px 16px',
    borderRadius: 8,
    border: '1.5px solid #e2e8f0',
    background: '#fff',
    fontSize: 14,
    cursor: 'pointer',
    color: '#555',
  },
  filterAktiv: {
    padding: '8px 16px',
    borderRadius: 8,
    border: '1.5px solid #1a1a1a',
    background: '#1a1a1a',
    fontSize: 14,
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 600,
  },
  hinweis: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 16,
  },
  cardSuche: {
    background: '#fff',
    borderRadius: 14,
    padding: '20px',
    borderLeft: '4px solid #10b981',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardBiete: {
    background: '#fff',
    borderRadius: 14,
    padding: '20px',
    borderLeft: '4px solid #f59e0b',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  badgeSuche: {
    background: '#f0fdf8',
    color: '#065f46',
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
  },
  badgeBiete: {
    background: '#fffbeb',
    color: '#78350f',
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
  },
  datum: {
    fontSize: 12,
    color: '#aaa',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  zeile: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 16,
    width: 24,
  },
  wert: {
    fontSize: 15,
    color: '#333',
  },
}