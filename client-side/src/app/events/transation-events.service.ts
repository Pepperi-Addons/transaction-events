import { Observable } from 'rxjs';
import jwt from 'jwt-decode';
import { FindOptions, FormDataView, PapiClient, Type } from '@pepperi-addons/papi-sdk';
import { Injectable } from '@angular/core';

import { PepHttpService, PepSessionService } from '@pepperi-addons/ngx-lib';
import { EventKeys, EventTimings, TransactionEventListeners } from '@pepperi-addons/events-shared';
import { FormMode } from '../entities';
import { TranslateService } from '@ngx-translate/core';


@Injectable({ providedIn: 'root' })
export class TransactionEventsService {

    accessToken = '';
    parsedToken: any
    papiBaseURL = ''
    addonUUID;

    get papiClient(): PapiClient {
        return new PapiClient({
            baseURL: this.papiBaseURL,
            token: this.session.getIdpToken(),
            addonUUID: this.addonUUID,
            suppressLogging:true
        })
    }

    constructor(
        public session:  PepSessionService,
        private pepHttp: PepHttpService,
        private translate: TranslateService
    ) {
        const accessToken = this.session.getIdpToken();
        this.parsedToken = jwt(accessToken);
        this.papiBaseURL = this.parsedToken["pepperi.baseurl"];
    }

    async getListeners (options: FindOptions = {}): Promise<TransactionEventListeners[]> {
        return await this.papiClient.addons.api.uuid(this.addonUUID).file('api').func('transaction_event_listeners').get(options);
    }

    async upsertListeners (obj: TransactionEventListeners): Promise<TransactionEventListeners> {
        return await this.papiClient.addons.api.uuid(this.addonUUID).file('api').func('transaction_event_listeners').post(undefined, obj);
    }
    
    async deleteListerner(obj: TransactionEventListeners): Promise<TransactionEventListeners> {
        obj.Hidden = true;
        return await this.papiClient.addons.api.uuid(this.addonUUID).file('api').func('transaction_event_listeners').post(undefined, obj);        
    }

    async getAtd(uuid: string): Promise<Type>{
        return await this.papiClient.addons.api.uuid(this.addonUUID).file('api').func('get_atd').get({'uuid': uuid});
    }

    async createDataView(mode:FormMode, formItem:TransactionEventListeners): Promise<FormDataView> {
        const result: FormDataView = {
            Type: 'Form',
            Context: {
                Name: '',
                Profile: { },
                ScreenSize: 'Tablet'
            },
            Columns: [{}, {}],
            Fields: [{
                FieldID: 'Name',
                Type: 'TextBox',
                Mandatory: true,
                ReadOnly: false,
                Title: this.translate.instant('Name'),
                Layout: {
                    Origin: {
                        X: 0,
                        Y: 0
                    },
                    Size: {
                        Width: 1,
                        Height: 0
                    }
                },
                Style: {
                    Alignment: {
                        Horizontal: 'Stretch',
                        Vertical: 'Stretch'
                    }
                }
            },
            {
                FieldID: 'Description',
                Type: 'TextBox',
                Mandatory: true,
                ReadOnly: false,
                Title: this.translate.instant('Description'),
                Layout: {
                    Origin: {
                        X: 1,
                        Y: 0
                    },
                    Size: {
                        Width: 1,
                        Height: 0
                    }
                },
                Style: {
                    Alignment: {
                        Horizontal: 'Stretch',
                        Vertical: 'Stretch'
                    }
                }
            },
            {
                FieldID: 'EventType',
                Type: 'ComboBox',
                Mandatory: true,
                ReadOnly: false,
                Title: this.translate.instant('Event Type'),
                Layout: {
                    Origin: {
                        X: 0,
                        Y: 1
                    },
                    Size: {
                        Width: 1,
                        Height: 0
                    }
                },
                Style: {
                    Alignment: {
                        Horizontal: 'Stretch',
                        Vertical: 'Stretch'
                    }
                }
            },
            {
                FieldID: 'Timing',
                Type: 'ComboBox',
                Mandatory: true,
                ReadOnly: false,
                Title: this.translate.instant('Event Timing'),
                Layout: {
                    Origin: {
                        X: 1,
                        Y: 1
                    },
                    Size: {
                        Width: 1,
                        Height: 0
                    }
                },
                Style: {
                    Alignment: {
                        Horizontal: 'Stretch',
                        Vertical: 'Stretch'
                    }
                }
            },
            {
                FieldID: 'FieldID',
                Type: 'TextBox',
                Mandatory: false,
                ReadOnly: true,
                Title: this.translate.instant('Field ID'),
                Layout: {
                    Origin: {
                        X: 0,
                        Y: 2
                    },
                    Size: {
                        Width: 1,
                        Height: 0
                    }
                },
                Style: {
                    Alignment: {
                        Horizontal: 'Stretch',
                        Vertical: 'Stretch'
                    }
                }
            },
            {
                FieldID: 'Group',
                Type: 'NumberInteger',
                Mandatory: false,
                ReadOnly: false,
                Title: this.translate.instant('Group'),
                Layout: {
                    Origin: {
                        X: 1,
                        Y: 2
                    },
                    Size: {
                        Width: 1,
                        Height: 0
                    }
                },
                Style: {
                    Alignment: {
                        Horizontal: 'Stretch',
                        Vertical: 'Stretch'
                    }
                }
            },
            {
                FieldID: 'RunScriptData',
                Type: 'Button',
                Mandatory: false,
                ReadOnly: false,
                Title: this.translate.instant('Script Picker'),
                Layout: {
                    Origin: {
                        X: 0,
                        Y: 3
                    },
                    Size: {
                        Width: 2,
                        Height: 0
                    }
                },
                Style: {
                    Alignment: {
                        Horizontal: 'Stretch',
                        Vertical: 'Stretch'
                    }
                }
            }]
        };

        result.Fields[2]["OptionalValues"] = Object.keys(EventKeys).map(item => {
            return {
                Key: item,
                Value: item
            }
        });

        result.Fields[3]["OptionalValues"] = Object.keys(EventTimings).map(item => {
            return {
                Key: item,
                Value: item
            }
        })

        return result;
    }
}
