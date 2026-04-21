import Link from 'next/link'
import type { CSSProperties } from 'react'

export default function Datenschutz() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <Link href="/" style={styles.logo}>🏠 Immo-Plattform</Link>
          <Link href="/inserate" style={styles.backBtn}>Alle Inserate</Link>
        </header>

        <div style={styles.card}>
          <h1 style={styles.titel}>Datenschutzerklärung</h1>

          <section style={styles.section}>
            <h2 style={styles.h2}>1. Verantwortlicher</h2>
            <p style={styles.p}>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
              [Dein Name]<br />
              [Straße und Hausnummer]<br />
              [PLZ Ort]<br />
              E-Mail: [deine@email.de]
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>2. Welche Daten erheben wir?</h2>
            <p style={styles.p}>
              Wenn du ein Inserat einstellst, speichern wir folgende Daten:
              Ort, Budget/Preis, Immobilienart, Größe, Zimmer, Beschreibung,
              E-Mail-Adresse, Telefonnummer (optional) und hochgeladene Bilder.
              Diese Daten werden in deinem Inserat öffentlich angezeigt, damit
              andere Nutzer dich kontaktieren können.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>3. Wie werden deine Daten gespeichert?</h2>
            <p style={styles.p}>
              Wir nutzen <strong>Supabase</strong> (Supabase Inc., 970 Toa Payoh North,
              Singapur) als Datenbank- und Speicher-Anbieter. Deine Daten werden
              auf Servern in der EU gespeichert. Mit Supabase besteht ein
              Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO.
            </p>
            <p style={styles.p}>
              Das Hosting der Website erfolgt über <strong>Vercel Inc.</strong>
              (440 N Barranca Ave #4133, Covina, CA 91723, USA).
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>4. Cookies</h2>
            <p style={styles.p}>
              Diese Website verwendet keine Tracking-Cookies und kein Analytics.
              Technisch notwendige Cookies können zur Sicherstellung der
              Funktionalität gesetzt werden.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>5. Deine Rechte</h2>
            <p style={styles.p}>
              Du hast jederzeit das Recht auf:<br />
              • Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)<br />
              • Berichtigung unrichtiger Daten (Art. 16 DSGVO)<br />
              • Löschung deiner Daten (Art. 17 DSGVO)<br />
              • Einschränkung der Verarbeitung (Art. 18 DSGVO)<br />
              • Datenübertragbarkeit (Art. 20 DSGVO)<br />
              • Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)
            </p>
            <p style={styles.p}>
              Um ein Inserat löschen zu lassen, schreib eine E-Mail an
              [deine@email.de] mit Angabe der Inserats-ID.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>6. Beschwerderecht</h2>
            <p style={styles.p}>
              Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu
              beschweren, wenn du der Meinung bist, dass die Verarbeitung deiner
              Daten gegen die DSGVO verstößt.
            </p>
          </section>

          <p style={styles.hinweis}>
            <strong>Hinweis:</strong> Diese Datenschutzerklärung wird vor dem
            offiziellen Launch mit einem Generator (z.B. e-recht24.de) finalisiert
            und an den tatsächlichen Betrieb angepasst.
          </p>

          <p style={styles.stand}>
            Stand: April 2026
          </p>
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
    padding: '20px',
  },
  container: {
    maxWidth: 800,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    marginBottom: 20,
  },
  logo: {
    fontSize: 20,
    fontWeight: 700,
    textDecoration: 'none',
    color: '#1a1a1a',
  },
  backBtn: {
    fontSize: 14,
    textDecoration: 'none',
    color: '#555',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '40px 36px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  titel: {
    margin: 0,
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 32,
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 28,
  },
  h2: {
    fontSize: 17,
    fontWeight: 600,
    marginBottom: 10,
    color: '#1a1a1a',
  },
  p: {
    fontSize: 15,
    lineHeight: 1.6,
    color: '#444',
    margin: '0 0 10px 0',
  },
  hinweis: {
    marginTop: 32,
    padding: 16,
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 10,
    fontSize: 14,
    color: '#78350f',
  },
  stand: {
    marginTop: 20,
    fontSize: 13,
    color: '#888',
    textAlign: 'center' as const,
  },
}