import { FormDataView } from '@pepperi-addons/papi-sdk';
import { TransactionEventListeners } from '@pepperi-addons/events-shared'

export type FormMode = 'Add' | 'Edit'

export interface EventFormData {
    Item: TransactionEventListeners;
    DataView: FormDataView
    Mode: FormMode;
}