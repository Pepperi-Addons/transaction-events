import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import { TranslateService } from '@ngx-translate/core';

import { TransactionEventsService } from "./transation-events.service";
import { PepDialogData, PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { TransactionEventListeners } from "@pepperi-addons/events-shared";
import { FormMode, EventFormData } from '../entities';
import { TransactionEventsFormComponent } from "./Form/transaction-events-form.component";
import { IPepGenericListActions, IPepGenericListDataSource } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";
import { Type } from "@pepperi-addons/papi-sdk";

@Component({
    selector: 'addon-block',
    templateUrl: './transaction-events.component.html',
    styleUrls: ['./transaction-events.component.scss']
})
export class TransactionEventsComponent implements OnInit {
    @Input() hostObject: any;
    
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    
    screenSize: PepScreenSizeType;

    listeners: TransactionEventListeners[];

    eventsDataSource: IPepGenericListDataSource;

    eventsActions: IPepGenericListActions = this.getActions();

    atd:Type;

    constructor(
        public service: TransactionEventsService,
        public layoutService: PepLayoutService,
        public translate: TranslateService,
        public dialogService: PepDialogService
    ) {
        this.layoutService.onResize$.subscribe(size => {
            this.screenSize = size;
        });
    }

    ngOnInit() {
        this.service.addonUUID = this.hostObject.options.addonId;
        this.service.getAtd(this.hostObject.objectList[0]).then(value => {
            this.atd = value;
            this.eventsDataSource = this.getDataSource();
        });
        
    }

    openDialog() {
        
    }

    getDataSource(): IPepGenericListDataSource {
        return {
            init: async(params:any) => {
                this.listeners = await this.service.getListeners();
                return Promise.resolve({
                    dataView: {
                        Context: {
                            Name: '',
                            Profile: { InternalID: 0 },
                            ScreenSize: 'Landscape'
                        },
                        Type: 'Grid',
                        Title: '',
                        Fields: [
                            {
                                FieldID: 'Name',
                                Type: 'TextBox',
                                Title: this.translate.instant('Name'),
                                Mandatory: false,
                                ReadOnly: true
                            },
                            {
                                FieldID: 'Description',
                                Type: 'TextBox',
                                Title: this.translate.instant('Description'),
                                Mandatory: false,
                                ReadOnly: true
                            },
                            {
                                FieldID: 'ModifictionDateTime',
                                Type: 'DateAndTime',
                                Title: this.translate.instant('Modification Date'),
                                Mandatory: false,
                                ReadOnly: true
                            },
                            {
                                FieldID: 'EventKey',
                                Type: 'TextBox',
                                Title: this.translate.instant('Event Key'),
                                Mandatory: false,
                                ReadOnly: true
                            },
                            {
                                FieldID: 'FieldID',
                                Type: 'TextBox',
                                Title: this.translate.instant('Field ID'),
                                Mandatory: false,
                                ReadOnly: true
                            },
                            {
                                FieldID: 'Group',
                                Type: 'NumberInteger',
                                Title: this.translate.instant('Group'),
                                Mandatory: false,
                                ReadOnly: true
                            },
                        ],
                        Columns: [
                            {
                                Width: 20
                            },
                            {
                                Width: 20
                            },
                            {
                                Width: 20
                            },
                            {
                                Width: 20
                            },
                            {
                                Width: 20
                            },
                            {
                                Width: 20
                            }
                        ],
          
                        FrozenColumnsCount: 0,
                        MinimumColumnWidth: 0
                    },
                    totalCount: this.listeners.length,
                    items: this.listeners
                });
            },
            inputs: () => {
                return Promise.resolve({
                    pager: {
                        type: 'pages'
                    },
                    selectionType: 'single',
                    noDataFoundMsg: this.translate.instant('Events_List_NoDataFound')
                });
            },
        } as IPepGenericListDataSource
    }

    getActions(): IPepGenericListActions {
        return {
            get: async (data: PepSelectionData) => {
                const actions = []
                if (data && data.rows.length == 1) {
                    actions.push({
                        title: this.translate.instant('Edit'),
                        handler: async (objs) => {
                            this.openForm('Edit', objs.rows[0]);
                        }
                    })
                    actions.push({
                        title: this.translate.instant('Delete'),
                        handler: async (objs) => {
                            this.showDeleteDialog(objs.rows[0]);
                        }
                    })
                }
                return actions;
            }
        }
    }

    async openForm(mode: FormMode, selectedKey: string = undefined) {
        const item = this.listeners.find(mapping=> mapping.Key === selectedKey);
        const formItem: TransactionEventListeners = {
            Key: selectedKey,
            AtdID: this.atd.InternalID,
            Active: item?.Active || true,
            Name: item?.Name || '',
            Description: item?.Description || '',
            EventKey: item?.EventKey || 'PreLoadTransactionScope',
            Timing: item?.Timing || 'Before',
            Group: item?.Group || -1,
            RunScriptData: item?.RunScriptData || undefined,
            FieldID: item?.FieldID || undefined
        }
        const formData: EventFormData = {
            Item: formItem,
            DataView: await this.service.createDataView(mode, formItem),
            Mode: mode
        }
        const config = this.dialogService.getDialogConfig({ }, 'large');
        config.data = new PepDialogData({
            content: TransactionEventsFormComponent
        })
        this.dialogService.openDialog(TransactionEventsFormComponent, formData, config).afterClosed().subscribe((value) => {
            if (value) {
                this.getDataSource();
            }
        });
    }

    showDeleteDialog(selectedKey: string) {
        const item = this.listeners.find(mapping=> mapping.Key === selectedKey);
        const dataMsg = new PepDialogData({
            title: this.translate.instant('Events_DeleteDialog_Title'),
            actionsType: 'cancel-delete',
            content: this.translate.instant('Events_DeleteDialog_Content')
        });
        this.dialogService.openDefaultDialog(dataMsg).afterClosed()
            .subscribe(async (isDeletePressed) => {
                if (isDeletePressed) {
                    try {
                        await this.service.deleteListerner(item);
                        this.getDataSource();
                    }
                    catch (err) {
                        const errorMsg = new PepDialogData({
                            title: this.translate.instant('Events_DeleteDialog_Title'),
                            actionsType: 'close',
                            content: this.translate.instant('Events_DeleteDialog_Error')
                        });             
                        this.dialogService.openDefaultDialog(errorMsg);
                    }
                }
        });
    }
}
