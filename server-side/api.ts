import { Client, Request } from '@pepperi-addons/debug-server'

import { EventsService } from './services/events-service'

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

