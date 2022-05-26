import { AddonData } from "@pepperi-addons/papi-sdk";

export const EventKeys = [
    'PreLoadTransactionScope',
    'OnLoadTransactionScope',
    'SetFieldValue',
    'IncrementFieldValue',
    'DecrementFieldValue'
];

export const EventTimings = [
    'Before',
    'Main',
    'After'
];

export type EventKey = typeof EventKeys[number];

export type EventTiming = typeof EventTimings[number];

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
