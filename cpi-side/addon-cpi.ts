import '@pepperi-addons/cpi-node'
import config from '../addon.config.json';
import { TransactionEventsScheme, groupBy, TransactionEventListeners } from '../shared';
import { SubscriptionManager } from './subscription-manager';

export async function load(configuration: any) {
    console.log('transaction events cpi side works!');
    // Put your cpi side code here

    const listeners = (await pepperi.api.adal.getList({
        addon: config.AddonUUID,
        table: TransactionEventsScheme.Name
    })).objects as TransactionEventListeners[]

    const atdMap = groupBy(listeners, x => x.AtdID);
    atdMap.forEach((items, atdID) => {
        new SubscriptionManager(items, atdID).subscribe();
    })
}

