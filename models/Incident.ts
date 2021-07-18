import * as Cfg from "../next.config.js";

export interface IIncident {
    emails: string[];
    relay?: string;
    date?: Date;
    category?: string;
    cause?: string;
    product?: string;
    resolutions?: string[];
    refundAmont?: number;
    comment?: string;
    _id?: string;
}

export class Incident implements IIncident {
    emails: string[];
    relay?: string;
    date?: Date;
    category?: string;
    cause?: string;
    product?: string;
    resolutions?: string[];
    refundAmont?: number;
    comment?: string;
    _id?: string;
    id?: string;
  
    constructor(data: IIncident) {
        this.emails = [];
        Object.assign(this, data);
        this.id = this._id;
        
    }

    // GET all incidents
    static async loadAll (): Promise<Incident[]> {
        try {
            const response: Response = (await fetch(Cfg.apiBaseUrl+"incidents", {
                method: "GET"
            }));
            const data: IIncident[] = await response.json();
            return data.map(item => new Incident(this.fromJSON(item)));
        } catch(e) {
            console.error('Data Load Failed with error', e);
            return [];
        }
        
    }

    // Upsert incident
    async save (): Promise<Incident> {
        let url = Cfg.apiBaseUrl+"incidents";
        let method = "POST";
        if(this._id) {
            url = url + '/'+this._id;
            method = "PUT"
        } 
        try {
            const response: Response = (await fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.toJSON())

            }));
            const data: IIncident = Incident.fromJSON(await response.json());
            return new Incident(data);
        } catch(e) {
            console.log(e);
            console.error('Data Load Failed with error', e);
            throw new Error("Data Load Failed with error");
        }
    }

    //attribute validation
    static validatePemail (emails: string[]): string {
        if(!emails || !Array.isArray(emails) || emails.length < 1) return "Missing email";
        for(let emailValue of emails) {
            if(emailValue.split('@').length < 2) {
                return "Email has a wrong format";
            }
            if((emailValue.split('@').pop() as string).split(".").length < 2) {
                return "Email has a wrong format";
            }
        }
        return "";
    }
    static validatePrelay (relay: string) {
        return !relay ? "Missing relay": ""
    }
    static validatePdate (date: Date) {
        if(!date)
            return  "Missing date";
        if(new Date(date).getTime() === NaN)
            return "Wrong date format";

        return "";
    }
    static validatePcause (cause: string) {
        return !cause ? "Missing cause": ""
    }
    static validatePcategory (category: string) {
        return !category ? "Missing category": ""
    }
    static validatePresolutions (resolutions: string[]): string {
        if(!resolutions || !Array.isArray(resolutions) || resolutions.length < 1) return "Missing resolutions";
        for(let resolutionValue of resolutions) {
            if(!resolutionValue) {
                return "Missing resolution";
            }
        }
        return "";
    }
    static validateEntity (entity: any): any {
        let errors:any = {};
        errors.emails = this.validatePemail(entity.emails) || undefined;
        errors.relay = this.validatePrelay(entity.relay) || undefined;
        errors.date = this.validatePdate(entity.date) || undefined;
        errors.cause = this.validatePcause(entity.cause) || undefined;
        errors.category = this.validatePcategory(entity.category) || undefined;
        errors.resolutions = this.validatePresolutions(entity.resolutions) || undefined;

        return errors;
    }

    //Serialization of defined parameters

    toJSON(): any {
        let obj:any = {emails: this.emails};
        if(this._id) obj._id = this._id;
        if(this.relay) obj.relay = this.relay;
        if(this.date) obj.date = this.date.toISOString();
        if(this.category) obj.category = this.category;
        if(this.cause) obj.cause = this.cause;
        if(this.resolutions) obj.resolutions = this.resolutions;
        if(this.refundAmont) obj.refundAmont = this.refundAmont;
        if(this.product) obj.product = this.product;
        if(this.comment) obj.comment = this.comment;
        return obj;
    }

    static fromJSON(_obj: any): IIncident {
        let obj:IIncident = {emails: _obj.emails};
        if(_obj._id) obj._id = _obj._id;
        if(_obj.relay) obj.relay = _obj.relay;
        if(_obj.date) obj.date = new Date(_obj.date);
        if(_obj.category) obj.category = _obj.category;
        if(_obj.cause) obj.cause = _obj.cause;
        if(_obj.resolutions) obj.resolutions = _obj.resolutions;
        if(_obj.refundAmont) obj.refundAmont = _obj.refundAmont;
        if(_obj.product) obj.product = _obj.product;
        if(_obj.comment) obj.comment = _obj.comment;
        return obj;
    }

}