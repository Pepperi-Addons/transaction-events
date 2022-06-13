
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'

import { UtilitiesService } from './services/utilities-service';

export async function install(client: Client, request: Request): Promise<any> {
    const service = new UtilitiesService(client);
    const result = {
        success: true,
        errorMessage: ''
    }

    try {
        await service.createADALScheme();
        await service.createRelation();
    }
    catch (err) {
        if (err instanceof Error) {
            result.errorMessage = `could not install addon. error messge ${err.message}`;
        }
        else {
            result.errorMessage = 'Unknown error occured';
        }
    }
    return result;
}

export async function uninstall(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function upgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function downgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}