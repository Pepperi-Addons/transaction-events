import { Client } from "@pepperi-addons/debug-server/dist";
import { AddonDataScheme, PapiClient, Relation } from "@pepperi-addons/papi-sdk";
import { SelectOptions, TransactionEventsScheme } from "@pepperi-addons/events-shared";
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
        
    async getAtd(uuid: string) {
        return  await this.papiClient.types.find({
            where: `UUID='${uuid}'`
        }).then((types) => {
            return types[0]
        });
    }

    async getTransactionTypes(): Promise<SelectOptions> {
        return (await this.papiClient.metaData.type('transactions').types.get()).map(type => {
            return {
                key: type.TypeID!.toString(),
                value: type.ExternalID!
            }
        })
    }

}