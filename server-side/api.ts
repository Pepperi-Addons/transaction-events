import { Client, Request } from '@pepperi-addons/debug-server'

import { EventsService } from './services/events-service'
import { UtilitiesService } from './services/utilities-service';

export async function transaction_event_listeners(client: Client, request: Request) {
    const service = new EventsService(client);
    let result: any = undefined;

    switch(request.method) {
        case 'GET': {
            result = await service.find(request.query);
            break;
        }
        case 'POST': {
            result = await service.upsert(request.body);
            break;
        }
        default: {
            const error: any = new Error('Method not supported');
            error.code = 405;
            throw error;
        }
    }

    return result;

};

export async function get_atd(client: Client, request: Request) {
    const service = new UtilitiesService(client);
    let result;
    
    switch (request.method) {
        case 'GET': {
            const uuid = request.query.uuid;
            result = await service.getAtd(uuid);
            break;
        }
        default: {
            let err: any = new Error(`Method ${request.method} not allowed`);
            err.code = 405;
            throw err;
        }        
    }
    
    return result;   
}


