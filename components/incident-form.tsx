
import React from "react";
import { Incident, IIncident } from '../models/Incident';
import { Card, TextField, Icon, Button, FormHelperText, CardContent, CardActions } from '@material-ui/core';
import { AddCircle, RemoveCircle } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import styles from './incident-form.module.scss';
import DateUtils from "@date-io/moment";
import { staticDataProvider } from "../services/static-data-provider";

interface PropsType {
    incident: IIncident
    onSubmit: (incident: Incident) => void
    onCancel: () => void
  }
//Form component for Incident Edition
export default class IncidentForm extends React.Component<PropsType, {}> {

    moment: DateUtils;
    state = {
        incident: ({
            emails: [],
            date: new Date()
        } as IIncident),
        relayList: staticDataProvider.relayPoints(),
        categoryList: staticDataProvider.categories(),
        productList: staticDataProvider.species(),
        causeList: ([] as string[]),
        resolutionList: staticDataProvider.resolutions(),
        validationErrors: ({} as any),
        hasRefund: false
    }
    

    constructor(props: PropsType) {
        super(props);
        this.moment = new DateUtils();
        //initial state with all static data
       if(props.incident) {
        this.state.incident = props.incident;
       }
    
    }

    /* Incident State managment */
    updateIncident = (e: React.ChangeEvent<any>, id: string) => {
        let cState: any = { ...this.state.incident };
        cState[id] = e.target?.value;
        this.setState({ incident: cState });
    }

    updateIncidentFromSelect = (e: React.ChangeEvent<any>, id: string) => {
        let cState: any = { ...this.state.incident };
        let idValue = (this.state as any)[id + "List"][(e.target as any).id.split("-").pop()];
        cState[id] = idValue;
        this.setState({ incident: cState });
    }

    updateCategory = (e: React.ChangeEvent<any>, id: string) => {
        let val: number = Number(e.target.id.split("-").pop());
        this.updateIncidentFromSelect(e, id);
        this.updateCauses(val);
    }

    
    /* React Fragments */
    productSelection() {
        return (
            <div>
                <Autocomplete
                    id="product"
                    options={this.state.productList}
                    value={this.state.incident.product || ''}
                    onChange={(e) => this.updateIncidentFromSelect(e, 'product')}
                    renderInput={(params) => <TextField
                        {...params}
                        label="Produit"
                    />
                    }
                />
            </div>
        );
    }

    emailList() {
        if (this.state.incident.emails.length < 1) {
            this.state.incident.emails.push('');
        }
        let removeEmailAt = (idx: number) => {
            let cState = { ...this.state.incident };
            cState.emails.splice(idx, 1);
            this.setState({ incident: cState });
        }
        let addEmail = () => {
            let cState = { ...this.state.incident };
            cState.emails.push('');
            this.setState({ incident: cState });
        }
        let editEmail = (e: React.ChangeEvent, idx: number) => {
            let cState: any = { ...this.state.incident };
            cState.emails[idx] = (e.target as any).value;
            this.setState({ incident: cState });
        }
        let listOfComps = this.state.incident.emails.map((email: string, idx: number) => {
            return (
                <li key={idx}>
                    <TextField
                        required={true}
                        id={"email_" + idx}
                        fullWidth={true}
                        error={this.state.validationErrors.emails}
                        label="Email"
                        value={email || ''}
                        onChange={(e) => editEmail(e, idx)}
                    />
                    <RemoveCircle onClick={(e) => removeEmailAt(idx)} className={styles.appendIconInline} ></RemoveCircle>
                </li>
            )
        });
        return (
            <ul>
                {listOfComps}
                <AddCircle onClick={(e) => addEmail()} className={styles.appendIcon} ></AddCircle>
                <FormHelperText error={this.state.validationErrors.emails}>{this.state.validationErrors.emails}</FormHelperText>
            </ul>
        )
    }


    resolutionList() {

        let addResolution = () => {
            let cState: any = { ...this.state.incident };
            cState.resolutions.push('');
            this.setState({ incident: cState });
        }
        let editResolution = (e: React.ChangeEvent<any>, idx: number) => {
            let cState: any = { ...this.state.incident };
            let idxValue: string[] = e.target?.id.split("-");
            cState.resolutions[idx] = this.state.resolutionList[Number(idxValue.pop())];
            if (cState.resolutions.indexOf("Remboursement total") > -1
                || cState.resolutions.indexOf("Remboursement partiel") > -1) {
                this.setState({ hasRefund: true })
            } else {
                this.setState({ hasRefund: false })
                cState.refundAmont = null;
            }

            this.setState({ incident: cState });
        }
        let removeResolutionAt = (idx: number) => {
            let cState: any = { ...this.state.incident };
            cState.resolutions.splice(idx, 1);
            this.setState({ incident: cState });
        }
        if (!this.state.incident.resolutions || this.state.incident.resolutions.length < 1) {
            let cState: any = { ...this.state.incident };
            cState.resolutions = [''];
            this.setState({ incident: cState });
        }

        let listOfComps = (this.state.incident.resolutions || ['']).map((resolution, idx) => {
            return (
                <li key={idx}>
                    <Autocomplete
                        id={"resolution_" + idx}
                        renderInput={(params) => <TextField
                            {...params}
                            error={this.state.validationErrors.resolutions}
                            label="Resolution"
                        />}
                        options={this.state.resolutionList}
                        value={resolution || ''}
                        onChange={(e) => editResolution(e, idx)}
                    />

                    <RemoveCircle onClick={(e) => removeResolutionAt(idx)} className={styles.appendIconInline} ></RemoveCircle>
                </li>
            )
        });
        return (
            <ul >

                {listOfComps}
                <AddCircle onClick={() => addResolution()} className={styles.appendIcon} ></AddCircle>
                <FormHelperText error={this.state.validationErrors.resolutions}>{this.state.validationErrors.resolutions}</FormHelperText>
            </ul>
        )
    }

    updateCauses(value: number) {
        this.setState({ causeList: staticDataProvider.causes()[this.state.categoryList[value]] });
    }

    /* Form actions */
    submitData(e: React.MouseEvent) {
        e.preventDefault();
        let entity = this.formatIncident();
        let validationErrors = Incident.validateEntity(entity);
        if (Object.values(validationErrors).filter(item => item != undefined).length > 0) {
            this.setState({ validationErrors });
        } else {
            (this.props as any).onSubmit(new Incident(entity));
        }
    }
    cancelSubmission(e: React.MouseEvent) {
        e.preventDefault();

        (this.props as any).onCancel();
    }

    formatIncident() {
        let incident = { ...this.state.incident };
        incident.date = incident.date ? this.moment.parse((incident.date as unknown as string), "YYYY-MM-DD").toDate() : new Date();
        incident.refundAmont = Number(incident.refundAmont);
        return incident;
    }

    /* Layout */
    render() {
        return (

            <form noValidate autoComplete="off" >
                <Card className={styles.fullHeightCard}>
                    <CardContent className={styles.incidentForm}>
                        {this.emailList()}
                        <div>
                            <Autocomplete
                                id="relay"
                                options={this.state.relayList}
                                value={this.state.incident.relay || ''}
                                onChange={(e) => this.updateIncidentFromSelect(e, 'relay')}
                                renderInput={(params) => <TextField
                                    {...params}
                                    required={true}
                                    helperText={this.state.validationErrors.relay}
                                    error={this.state.validationErrors.relay}
                                    label="Point Relais"
                                />
                                }
                            />
                        </div>

                        <div>
                            <TextField
                                type="date"
                                id="date"
                                label="Date"
                                helperText={this.state.validationErrors.date}
                                error={this.state.validationErrors.date}
                                value={this.moment.date(this.state.incident.date).format("YYYY-MM-DD")}
                                onChange={(e) => this.updateIncident(e, 'date')}
                                fullWidth={true}
                                required={true}
                            />

                        </div>

                        <div>
                            <Autocomplete
                                id="category"
                                options={this.state.categoryList}
                                value={this.state.incident.category || ''}
                                onChange={(e) => this.updateCategory(e, 'category')}
                                renderInput={(params) => <TextField
                                    {...params}
                                    label="Type"
                                    helperText={this.state.validationErrors.category}
                                    error={this.state.validationErrors.category}
                                />
                                }
                            />
                        </div>

                        <div>
                            <Autocomplete
                                id="cause"
                                options={this.state.causeList}
                                value={this.state.incident.cause || ''}
                                disabled={this.state.incident.category === undefined}
                                onChange={(e) => this.updateIncidentFromSelect(e, 'cause')}
                                renderInput={(params) => <TextField
                                    required={true}
                                    {...params}
                                    label="Cause"
                                    helperText={this.state.validationErrors.cause}
                                    error={this.state.validationErrors.cause}
                                />
                                }
                            />
                        </div>
                        {this.state.incident.category === "Produit" ? this.productSelection() : ''}

                        {this.resolutionList()}

                        <div>
                            <TextField
                                type="number"
                                id="refundAmont"
                                label="Montant Remboursé"
                                helperText={this.state.validationErrors.refundAmont}
                                onChange={(e) => this.updateIncident(e, 'refundAmont')}
                                disabled={!this.state.hasRefund}
                                fullWidth={true}
                            />
                        </div>

                        <div>
                            <TextField
                                id="comment"
                                label="Commentaire"
                                value={this.state.incident.comment || ''}
                                onChange={(e) => this.updateIncident(e, 'comment')}
                                multiline={true}
                                fullWidth={true}
                            />
                        </div>
                    </CardContent>
                    <CardActions>

                        <Button
                            type="button"
                            onClick={(e) => this.cancelSubmission(e)}
                            color={'secondary'}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            onClick={(e) => this.submitData(e)}
                            color={'primary'}
                            variant="contained"
                        >
                            Enregistrer
                        </Button>

                    </CardActions>
                </Card>

            </form>

        )
    }
}