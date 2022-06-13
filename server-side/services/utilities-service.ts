import { Client } from "@pepperi-addons/debug-server/dist";
import { AddonDataScheme, PapiClient, Relation } from "@pepperi-addons/papi-sdk";
import { TransactionEventsScheme } from "../../shared/src/metadata";
import { AtdRelation } from "../metadata"

export class UtilitiesService {

    papiClient: PapiClient;
    
    constructor (client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID,
            
        })
    }

    async createRelation(): Promise<Relation> {
        return await this.papiClient.addons.data.relations.upsert(AtdRelation);
    }

    async createADALScheme(): Promise<AddonDataScheme> {
        return await this.papiClient.addons.data.schemes.post(TransactionEventsScheme);
    }

}