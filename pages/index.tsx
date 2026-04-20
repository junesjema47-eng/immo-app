import { useState } from 'react'
import type { CSSProperties } from 'react'
import supabase from '../lib/supabaseClient'

type Rolle = 'suche' | 'biete' | null

export default function Home() {
  const [rolle, setRolle] = useState<Rolle>(null)
  const [ort, setOrt] = useState('')
  const [budget, setBudget] = useState('')
  const [immobilienart, setImmobilienart] = useState('')
  const [gesendet, setGesendet] = useState(false)
  const [laden, setLaden] = useState(false)
  const [fehler, setFehler] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!ort || !budget || !immobilienart) {
      setFehler('Bitte alle Felder ausfüllen.')
      return
    }
    setLaden(true)
    setFehler(null)

    const { error } = await supabase
      .from('inserate')
      .insert([{ rolle, ort, budget, immobilienart }])

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
    setGesendet(false)
    setFehler(null)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.titel}>🏠 Immo-Plattform</h1>
        <p style={styles.sub}>Investoren & Anbieter verbinden</p>

        {gesendet && (
          <div style={styles.erfolg}>
            <p style={{ fontSize: 40, margin: 0 }}>✅</p>
            <p style={{ fontWeight: 'bold', fontSize: 18 }}>Erfolgreich gespeichert!</p>
            <p style={{ color: '#555' }}>
              {rolle === 'suche'
                ? 'Wir melden uns wenn passende Objekte verfügbar sind.'
                : 'Dein Inserat ist online. Investoren können dich finden.'}
            </p>
            <button style={styles.btnReset} onClick={reset}>
              Neues Inserat
            </button>
          </div>