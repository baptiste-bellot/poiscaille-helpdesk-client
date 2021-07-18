
import React from "react";
import { Incident, IIncident } from '../models/Incident';
import { XGrid } from '@material-ui/x-grid'; //Provide Multi Sort and colomn resize among other thing but isn't available for free
import { DataGrid } from '@material-ui/data-grid';
import { Container } from '@material-ui/core';
import styles from "./incidents.module.css";
import DateUtils from "@date-io/moment";


export default class IncidentsTable extends React.Component {


    columns: any[];
    moment: DateUtils;
    state = { incidents: ([] as IIncident[])};

    constructor(props: any) {
        super(props);
        this.moment = new DateUtils();

        //Table columns setup
        this.columns = [
            {
                field: 'emails',
                headerName: 'Email client',
                width: 200,
                valueGetter: (params: any) =>
                    params.value ? params.value.join('; ') : ''//;
            },
            {
                field: 'relay',
                headerName: 'Point Relais',
                width: 190
            },
            {
                field: 'date',
                headerName: 'Date',
                width: 110,
                valueGetter: (params: any) =>
                    params.value ? this.moment.date(params.value).format('DD/MM/YYYY') : ''//;               
            },
            {
                field: 'category',
                headerName: 'Type',
                width: 130
            },
            {
                field: 'cause',
                headerName: 'Cause',
                width: 130
            },
            {
                field: 'resolutions',
                headerName: 'Resolutions',
                width: 190,
                valueGetter: (params: any) =>
                    params.value ? params.value.join(' - ') : ''
            },
            {
                field: 'refundAmont',
                headerName: 'Montant remboursé',
                width: 200,
                valueGetter: (params: any) =>
                    (params.value || "0") + " €"
            }
        ]
        

    }

    /* load data */
    componentDidMount() {
        Incident.loadAll().then((incidents: Incident[]) => {
            this.setState({ incidents: incidents });
        });
    }

    //component layout
    render() {
        return (
            <Container className={styles.tablecontainer}>
                <DataGrid
                    rows={this.state.incidents}
                    columns={this.columns}
                    pageSize={10}
                    sortModel={[
                        {
                            field: 'date',
                            sort: 'desc',
                        },
                    ]}
                ></DataGrid>
            </Container>
        )
    }
}