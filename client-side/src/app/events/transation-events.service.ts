import { Observable } from 'rxjs';
import jwt from 'jwt-decode';
import { FindOptions, PapiClient } from '@pepperi-addons/papi-sdk';
import { Injectable } from '@angular/core';

import { PepHttpService, PepSessionService } from '@pepperi-addons/ngx-lib';
import { TransactionEventListeners } from '../../../../shared/src/entities';


@Injectable({ providedIn: 'root' })
export class TransactionEventsService {

    accessToken = '';
    parsedToken: any
    papiBaseURL = ''
    addonUUID;

    get papiClient(): PapiClient {
        return new PapiClient({
            baseURL: this.papiBaseURL,
            token: this.session.getIdpToken(),
            addonUUID: this.addonUUID,
            suppressLogging:true
        })
    }

    constructor(
        public session:  PepSessionService,
        private pepHttp: PepHttpService
    ) {
        const accessToken = this.session.getIdpToken();
        this.parsedToken = jwt(accessToken);
        this.papiBaseURL = this.parsedToken["pepperi.baseurl"];
    }

    async find (options: FindOptions = {}): Promise<TransactionEventListeners[]> {
        return await this.papiClient.addons.api.uuid(this.addonUUID).file('api').func('transaction_event_listeners').get(options);
    }

    async upsert (obj: TransactionEventListeners): Promise<TransactionEventListeners> {
        return await this.papiClient.addons.api.uuid(this.addonUUID).file('api').func('transaction_event_listeners').post(obj);
    }

}
