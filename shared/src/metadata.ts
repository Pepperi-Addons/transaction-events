import { AddonDataScheme } from '@pepperi-addons/papi-sdk'

export const TransactionEventsScheme: AddonDataScheme = {
    Name: 'TransactionEventListeners',
    Type: 'cpi_meta_data',
    Fields: {
        Description: {
            Type:'String'
        },
        EventKey: {
            Type: 'String'
        },
        FieldID: {
            Type: 'String'
        },
        RunScriptData: {
            Type: 'Object'
        },
        AtdID: {
            Type: 'String'
        },
        Group: {
            Type: 'Integer'
        },
        Timing: {
            Type: 'String'
        },
        Active: {
            Type: 'Bool'
        }
    }
    
}