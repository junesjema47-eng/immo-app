import { useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import supabase from '../lib/supabaseClient'

type Rolle = 'suche' | 'biete' | null

export default function Home() {
  const [rolle, setRolle] = useState<Rolle>(null)
  const [ort, setOrt] = useState('')
  const [budget, setBudget] = useState('')
  const [immobilienart, setImmobilienart] = useState('')
  const [email, setEmail] = useState('')
  const [telefon, setTelefon] = useState('')
  const [groesse, setGroesse] = useState('')
  const [zimmer, setZimmer] = useState('')
  const [beschreibung, setBeschreibung] = useState('')
  const [gesendet, setGesendet] = useState(false)
  const [laden, setLaden] = useState(false)
  const [fehler, setFehler] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!ort || !budget || !immobilienart || !email) {
      setFehler('Bitte Ort, Budget, Immobilienart und E-Mail ausfüllen.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFehler('Bitte eine gültige E-Mail-Adresse eingeben.')
      return
    }
    setLaden(true)
    setFehler(null)

    const { error } = await supabase
      .from('inserate')
      .insert([{
        rolle,
        ort,
        budget,
        immobilienart,
        email,
        telefon: telefon || null,
        groesse: groesse || null,
        zimmer: zimmer || null,
        beschreibung: beschreibung || null,
      }])

    if (error) {
      setFehler('Fehler beim Speichern. Bitte nochmal versuchen.')
      console.error(error)
    } else {
      setGesendet(true)
    }
    setLaden(false)
  }

  const reset = () => {
    setRolle(null)
    setOrt('')
    setBudget('')
    setImmobilienart('')
    setEmail('')
    setTelefon('')
    setGroesse('')
    setZimmer('')
    setBeschreibung('')
    setGesendet(false)
    setFehler(null)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topNav}>
          <h1 style={styles.titel}>🏠 Immo-Plattform</h1>
          <Link href="/inserate" style={styles.navLink}>
            Alle Inserate →
          </Link>
        </div>
        <p style={styles.sub}>Investoren & Anbieter verbinden</p>

        {gesendet && (
          <div style={styles.erfolg}>
            <p style={{ fontSize: 40, margin: 0 }}>✅</p>
            <p style={{ fontWeight: 'bold', fontSize: 18, color: '#1a1a1a' }}>Erfolgreich veröffentlicht!</p>
            <p style={{ color: '#555' }}>
              Dein Eintrag ist jetzt im Marktplatz sichtbar.
            </p>
            <Link href="/inserate" style={styles.btnPrimary}>
              Alle Inserate ansehen →
            </Link>
            <button style={styles.btnSecondary} onClick={reset}>
              Weiteres Inserat aufgeben
            </button>
          </div>
        )}

        {!rolle && !gesendet && (
          <div>
            <p style={styles.frage}>Was möchtest du tun?</p>
            <div style={styles.btnReihe}>
              <button style={styles.btnSuche} onClick={() => setRolle('suche')}>
                🔍 Ich suche eine Immobilie
              </button>
              <button style={styles.btnBiete} onClick={() => setRolle('biete')}>
                🏢 Ich biete eine Immobilie
              </button>
            </div>
          </div>
        )}

        {rolle && !gesendet && (
          <div>
            <p style={styles.rolleLabel}>
              {rolle === 'suche' ? '🔍 Ich suche eine Immobilie' : '🏢 Ich biete eine Immobilie'}
              <button onClick={reset} style={styles.aendern}>ändern</button>
            </p>

            <div style={styles.formGroup}>
              <label style={styles.label}>Ort *</label>
              <input
                style={styles.input}
                placeholder="z. B. Berlin, München, Hamburg..."
                value={ort}
                onChange={(e) => setOrt(e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                {rolle === 'suche' ? 'Budget (€) *' : 'Preis (€) *'}
              </label>
              <input
                style={styles.input}
                placeholder={rolle === 'suche' ? 'z. B. 300.000' : 'z. B. 450.000'}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Immobilienart *</label>
              <select
                style={styles.input}
                value={immobilienart}
                onChange={(e) => setImmobilienart(e.target.value)}
              >
                <option value="">Bitte wählen...</option>
                <option>Eigentumswohnung</option>
                <option>Mehrfamilienhaus</option>
                <option>Einfamilienhaus</option>
                <option>Gewerbeimmobilie</option>
                <option>Grundstück</option>
                <option>Pflegeimmobilie</option>
                <option>Ferienimmobilie</option>
              </select>
            </div>

            <div style={styles.zweierReihe}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Größe (m²)</label>
                <input
                  style={styles.input}
                  placeholder="z. B. 85"
                  value={groesse}
                  onChange={(e) => setGroesse(e.target.value)}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Zimmer</label>
                <input
                  style={styles.input}
                  placeholder="z. B. 3"
                  value={zimmer}
                  onChange={(e) => setZimmer(e.target.value)}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                {rolle === 'suche' ? 'Deine Wünsche' : 'Beschreibung'}
              </label>
              <textarea
                style={styles.textarea}
                placeholder={
                  rolle === 'suche'
                    ? 'z. B. Balkon, Altbau, Nähe S-Bahn...'
                    : 'z. B. Renoviert 2022, Süd-Balkon, Tiefgarage...'
                }
                value={beschreibung}
                onChange={(e) => setBeschreibung(e.target.value)}
                rows={3}
              />
            </div>

            <p style={styles.sektion}>Deine Kontaktdaten</p>

            <div style={styles.formGroup}>
              <label style={styles.label}>E-Mail *</label>
              <input
                style={styles.input}
                type="email"
                placeholder="du@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Telefon</label>
              <input
                style={styles.input}
                type="tel"
                placeholder="optional"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
              />
            </div>

            {fehler && <p style={styles.fehler}>{fehler}</p>}

            <button
              style={laden ? styles.btnSendenLaden : styles.btnSenden}
              onClick={handleSubmit}
              disabled={laden}
            >
              {laden ? 'Wird gespeichert...' : rolle === 'suche' ? 'Suche absenden' : 'Inserat veröffentlichen'}
            </button>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
    padding: '20px',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '40px 36px',
    maxWidth: 480,
    width: '100%',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  topNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titel: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: '#1a1a1a',
  },
  navLink: {
    fontSize: 13,
    color: '#666',
    textDecoration: 'none',
    fontWeight: 600,
  },
  sub: {
    color: '#888',
    marginTop: 0,
    marginBottom: 32,
  },
  frage: {
    fontWeight: 600,
    fontSize: 17,
    marginBottom: 16,
    color: '#1a1a1a',
  },
  btnReihe: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  btnSuche: {
    padding: '16px 20px',
    borderRadius: 12,
    border: '2px solid #10b981',
    background: '#f0fdf8',
    color: '#065f46',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'left',
  },
  btnBiete: {
    padding: '16px 20px',
    borderRadius: 12,
    border: '2px solid #f59e0b',
    background: '#fffbeb',
    color: '#78350f',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'left',
  },
  rolleLabel: {
    fontWeight: 600,
    fontSize: 15,
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: '#1a1a1a',
  },
  aendern: {
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: 13,
    textDecoration: 'underline',
  },
  formGroup: {
    marginBottom: 18,
    flex: 1,
  },
  zweierReihe: {
    display: 'flex',
    gap: 12,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#444',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  sektion: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1a1a1a',
    marginTop: 24,
    marginBottom: 12,
    paddingTop: 16,
    borderTop: '1px solid #e2e8f0',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1.5px solid #e2e8f0',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fafafa',
    color: '#1a1a1a',
  },
  textarea: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1.5px solid #e2e8f0',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fafafa',
    color: '#1a1a1a',
    fontFamily: 'system-ui, sans-serif',
    resize: 'vertical',
  },
  fehler: {
    color: '#e53e3e',
    fontSize: 14,
    marginBottom: 12,
  },
  btnSenden: {
    width: '100%',
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
  },
  btnSendenLaden: {
    width: '100%',
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    background: '#999',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'not-allowed',
    marginTop: 8,
  },
  erfolg: {
    textAlign: 'center',
    padding: '20px 0',
  },
  btnPrimary: {
    display: 'inline-block',
    marginTop: 16,
    padding: '12px 24px',
    borderRadius: 10,
    background: '#1a1a1a',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    textDecoration: 'none',
  },
  btnSecondary: {
    display: 'block',
    marginTop: 12,
    padding: '10px 20px',
    borderRadius: 10,
    border: '1.5px solid #e2e8f0',
    background: '#fff',
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}