import '@pepperi-addons/cpi-node';
import { EventData } from '@pepperi-addons/cpi-node';
import {groupBy, TransactionEventListeners} from '@pepperi-addons/events-shared'

export class SubscriptionManager {
    
    constructor (private configs: TransactionEventListeners[], private atdID) {
    }

    subscribe() {
        const filter = {
            DataObject: {
                typeDefinition: {
                    internalID: Number(this.atdID)
                }
            }
        }

        pepperi.events.intercept('PreLoadTransactionScope', filter, async (data: EventData, next, main) => {
            const events = this.configs.filter((item) => {
                return item.EventKey === 'PreLoadTransactionScope';
            })

            await this.handleEvents(events, data, next, main);
        })

        pepperi.events.intercept('OnLoadTransactionScope', filter, async (data: EventData, next, main) => {
            const events = this.configs.filter((item) => {
                return item.EventKey === 'OnLoadTransactionScope'
            })

            await this.handleEvents(events, data, next, main);
        })

        pepperi.events.intercept('SetFieldValue', filter, async (data: EventData, next, main) => {
            const events = this.configs.filter((item) => {
                return item.EventKey === 'SetFieldValue' && (item.FieldID ? item.FieldID === data.FieldID : true)
            })

            await this.handleEvents(events, data, next, main);
        })
        
        pepperi.events.intercept('IncrementFieldValue', filter, async (data: EventData, next, main) => {
            const events = this.configs.filter((item) => {
                return item.EventKey === 'IncrementFieldValue' && (item.FieldID ? item.FieldID === data.FieldID : true)
            })

            await this.handleEvents(events, data, next, main);
        })

        pepperi.events.intercept('DecrementFieldValue', filter, async (data: EventData, next, main) => {
            debugger;
        const events = this.configs.filter((item) => {
                return item.EventKey === 'DecrementFieldValue' && (item.FieldID ? item.FieldID === data.FieldID : true)
            })

            await this.handleEvents(events, data, next, main);
        })
    }

    async handleEvents(events: TransactionEventListeners[], data: EventData, next, main) {
            const beforeEvents = events.filter(item => item.Timing === 'Before');
            const mainEvents = events.filter(item => item.Timing === 'Main');
            const afterEvents = events.filter(item => item.Timing === 'After');

            await this.runEvents(beforeEvents, data.DataObject?.uuid, data.client!);
            
            if(mainEvents.length > 0) {
                main = async (data) => { 
                    await this.runEvents(mainEvents, data.DataObject?.uuid, data.client!);
                }
            }
            
            await next(main);
            
            await this.runEvents(afterEvents, data.DataObject?.uuid, data.client!);
    }

    async runEvents(events: TransactionEventListeners[], objectUUID: string = '', client: any) {
        const groupedEvents = groupBy(events, (x:TransactionEventListeners) => x.Group);
        await Promise.all(Object.keys(groupedEvents).sort((a,b)=> {
            return Number(a) - Number(b);
        }).map(async(group) => {
            console.log(`about to call group events for group ${group}. number of events: ${groupedEvents[group].length}`)
            await Promise.all(groupedEvents[group].map(async (event) => {
                const scriptData = this.getEventData(event.RunScriptData, objectUUID);
                await pepperi.scripts.key(event.RunScriptData.ScriptKey).run(scriptData, client)
            }))
            console.log(`after executing events for group ${group}`);
        }));
    }

    getEventData(data: any, objectUUID = '') {
        const result = {};
        Object.keys(data.ScriptData).forEach(key => {
            const item = data.ScriptData[key];
            let value = item.Value;
            if (item.Source === 'dynamic' && (item.Value === 'TransactionUUID' || item.Value === 'ItemUUID')) {
                    value = objectUUID;
            }
            result[key] = value;
        })
        return result;
    }
}