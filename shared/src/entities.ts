export type EventKey = 'PreLoadTransactionScope' | 'OnLoadTransactionScope' | 'SetFieldValue' | 'IncrementFieldValue' | 'DecrementFieldValue';
export type EventTiming = 'Before' | 'Main' | 'After';

export interface TransactionEventListeners {
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