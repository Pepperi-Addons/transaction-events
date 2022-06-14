import '@pepperi-addons/cpi-node'
import config from '../addon.config.json';
import { TransactionEventsScheme, groupBy, TransactionEventListeners } from '@pepperi-addons/events-shared';
import { SubscriptionManager } from './subscription-manager';

export async function load(configuration: any) {
    console.log('transaction events cpi side works!');
    // Put your cpi side code here

    const listeners = ((await pepperi.api.adal.getList({
        addon: config.AddonUUID,
        table: TransactionEventsScheme.Name
    })).objects as TransactionEventListeners[]).filter(item => item.Active);
    const atdMap = groupBy(listeners, x => x.AtdID);
    Object.keys(atdMap).map((atdID) => {
        new SubscriptionManager(atdMap[atdID], atdID).subscribe();
    })
}

