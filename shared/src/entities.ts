import { AddonData } from "@pepperi-addons/papi-sdk";

export enum EventKeys {
    'PreLoadTransactionScope',
    'OnLoadTransactionScope',
    'SetFieldValue',
    'IncrementFieldValue',
    'DecrementFieldValue'
};

export enum EventTimings { 
    'Before',
    'Main',
    'After'
}

export type EventKey = keyof typeof EventKeys;
export type EventTiming = keyof typeof EventTimings;

export interface TransactionEventListeners extends AddonData {
    AtdID: number,
    Name: string, 
    Description: string,
    Key: string,
    EventKey: EventKey,
    Timing: EventTiming,
    FieldID?: string,
    RunScriptData: any,
    Group: number,
    Active: boolean
}
