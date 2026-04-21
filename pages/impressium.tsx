import Link from 'next/link'
import type { CSSProperties } from 'react'

export default function Impressum() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <Link href="/" style={styles.logo}>🏠 Immo-Plattform</Link>
          <Link href="/inserate" style={styles.backBtn}>Alle Inserate</Link>
        </header>

        <div style={styles.card}>
          <h1 style={styles.titel}>Impressum</h1>

          <section style={styles.section}>
            <h2 style={styles.h2}>Angaben gemäß § 5 DDG</h2>
            <p style={styles.p}>
              [Dein Name]<br />
              [Straße und Hausnummer]<br />
              [PLZ Ort]<br />
              Deutschland
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>Kontakt</h2>
            <p style={styles.p}>
              E-Mail: [deine@email.de]<br />
              Telefon: [+49 ...]
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p style={styles.p}>
              [Dein Name]<br />
              [Straße und Hausnummer]<br />
              [PLZ Ort]
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>Haftungsausschluss</h2>
            <p style={styles.p}>
              Die Inhalte dieser Website werden mit größter Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
              übernehmen wir jedoch keine Gewähr. Die Inserate auf dieser
              Plattform werden von Nutzern selbst eingestellt. Wir übernehmen
              keine Haftung für den Inhalt oder die Richtigkeit der
              Nutzer-Inserate.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>Urheberrecht</h2>
            <p style={styles.p}>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              dieser Website unterliegen dem deutschen Urheberrecht. Bilder in
              Inseraten stammen von den jeweiligen Nutzern, die für die Rechte
              an ihren Bildern selbst verantwortlich sind.
            </p>
          </section>

          <p style={styles.hinweis}>
            <strong>Hinweis:</strong> Dieses Impressum wird überarbeitet,
            sobald die Plattform gewerblich betrieben wird.
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
    margin: 0,
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
}