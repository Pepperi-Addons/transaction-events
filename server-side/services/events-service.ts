import { FindOptions } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';

import { UtilitiesService } from './utilities-service';
import { TransactionEventsScheme, TransactionEventListeners} from '@pepperi-addons/events-shared';

import config from '../../addon.config.json'

export class EventsService {

    private utilitiesService: UtilitiesService

    constructor(private client: Client) {
        this.utilitiesService = new UtilitiesService(client);
    }

    async find (options: FindOptions = {}): Promise<TransactionEventListeners[]> {
        return await this.utilitiesService.papiClient.addons.data.uuid(config.AddonUUID).table(TransactionEventsScheme.Name).find(options) as TransactionEventListeners[];
    }

    async upsert(object: TransactionEventListeners): Promise<TransactionEventListeners> {
        return await this.utilitiesService.papiClient.addons.data.uuid(config.AddonUUID).table(TransactionEventsScheme.Name).upsert(object) as TransactionEventListeners;
    }

    async getByKey(itemKey: string): Promise<TransactionEventListeners> {
        return await this.utilitiesService.papiClient.addons.data.uuid(config.AddonUUID).table(TransactionEventsScheme.Name).key(itemKey).get() as TransactionEventListeners;
    }

}