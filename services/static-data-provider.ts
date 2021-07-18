import * as Categories from "./static-data/categories.json";
import * as RelayPoints from "./static-data/relay.json";
import * as Causes from "./static-data/causes.json";
import * as Species from "./static-data/species.json";
import * as Resolutions from "./static-data/resolutions.json";

class StaticDataProvider {

    private _relayPoints: string[];
    private _categories: string[];
    private _resolutions: string[];
    private _species: string[];
    private _causes: {[key: string]: string[]};

    constructor() {
        this._relayPoints = RelayPoints;
        this._categories = Categories;
        this._resolutions = Resolutions;
        this._species = Species;
        this._causes = Causes;
    }

    categories(): string[] {
        return Array.from(this._categories);
    }
    relayPoints(): string[] {
        return Array.from(this._relayPoints);
    }
    species(): string[] {
        return Array.from(this._species);
    }
    causes(): {[key: string]: string[]} {
        return this._causes;
    }
    resolutions(): string[] {
        return Array.from(this._resolutions);
    }

}

export const staticDataProvider = new StaticDataProvider();