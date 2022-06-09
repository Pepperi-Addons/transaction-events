import { AddonData } from "@pepperi-addons/papi-sdk";

export const EventKeys = [
    'PreLoadTransactionScope',
    'OnLoadTransactionScope',
    'SetFieldValue',
    'IncrementFieldValue',
    'DecrementFieldValue'
] as const

export const EventTimings = [ 
    'Before',
    'Main',
    'After'
] as const

export type EventKey = typeof EventKeys[number];
export type EventTiming = typeof EventTimings[number];

export interface TransactionEventListeners extends AddonData {
    AtdID: string,
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

export type SelectOptions = {
    key: string,
    value: string
}[]
