
import Container from '@material-ui/core/Container';
import IncidentForm from '../../components/incident-form';
import { Incident } from '../../models/Incident';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { Snackbar } from '@material-ui/core';
import { useState } from 'react';

import { useRouter } from 'next/router';

/* Incident Edition page */
export default function EditIncident() {
    const router = useRouter();
    let readyToGoBack = false;

    const submitForm = (incident: Incident) => {
        incident.save().then(incident => {
            setState({
                open: true,
                incident: incident
            });
            readyToGoBack = true;
            setTimeout(() => {
                router.push("/");
            }, 6000);
        });
    }

    const cancelForm = () => {
        router.push("/");
    }

    const handleClose = () => {
       
        setState({
            open: false,
            incident: state.incident
        });
        if(readyToGoBack) {
            router.push("/");
        }
    }
    const [state, setState] = useState({open: false, incident: {emails: ['']}})

    return (
        <div className={styles.container}>
            
            <Head>
                <title>Poiscaille HelpDesk</title>
                <meta name="description" content="Outils de suivi des rapport d'incident" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main className={styles.main}>
            <Container>
                <h1 >
                    Enregistrer un nouvel incident
                </h1>

                <IncidentForm incident={state.incident} onSubmit={submitForm} onCancel={cancelForm}>
                
                </IncidentForm>

                <Snackbar 
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={state.open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message="Incident enregistré avec succes."
               />
                
                
            </Container>
            </main>
            <footer className={styles.footer}>
                    <p>@Poiscaille - 2021</p>
            </footer>
        </div>
    )
}