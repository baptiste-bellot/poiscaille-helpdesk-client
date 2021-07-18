import Head from 'next/head'
import styles from '../styles/Home.module.css'

import IncidentsTable from '../components/incidents';
import Link from 'next/link'
import { Card, Container, Button, CardContent, CardHeader, Divider } from '@material-ui/core';



export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Poiscaille HelpDesk</title>
        <meta name="description" content="Outils de suivi des rapport d'incidents" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>
        <Container>

          <h1 className={styles.title}>
            Bienvenue sur &laquo; Poiscaille HelpDesk &raquo;
          </h1>

          <nav className={styles.navBar}>
            <Link href='/incidents/edit' passHref>
              <Button color="primary" variant="contained"> Enregistrer un nouvel incident</Button>
            </Link>
          </nav>
          <Divider />

          <Card>
            <CardHeader>
              <h3>Incidents</h3>
            </CardHeader>

            <CardContent>

              <IncidentsTable></IncidentsTable>
            </CardContent>
          </Card>

        </Container>

        
      </main>

      <footer className={styles.footer}>
        <p>@Poiscaille - 2021</p>
      </footer>
    </div>
  )
}
