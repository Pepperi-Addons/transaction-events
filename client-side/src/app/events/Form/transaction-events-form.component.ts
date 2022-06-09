import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewContainerRef } from "@angular/core";
import { KeyValuePair, PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import { TranslateService } from '@ngx-translate/core';

import { TransactionEventsService } from "../transation-events.service";
import { PepDialogData, PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader'
import { EventKeys, EventTimings, SelectOptions, TransactionEventListeners } from "@pepperi-addons/events-shared";
import { FormMode, EventFormData } from '../../entities';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'addon-block',
    templateUrl: './transaction-events-form.component.html',
    styleUrls: ['./transaction-events-form.component.scss']
})
export class TransactionEventsFormComponent implements OnInit {

    isFormValid: boolean = false;
    item: TransactionEventListeners = null;
    itemKey: string;
    formData: EventFormData;
    itemLoaded: boolean = false;

    eventTypeOptions: SelectOptions = EventKeys.map(item => {
        return {
            key: item,
            value: item
        }
    })

    eventTimingOptions: SelectOptions = EventTimings.map(item => {
        return {
            key: item,
            value: item
        }
    })

    transactionTypesOptions: SelectOptions = [];

    hostObject;
    
    constructor ( private translate: TranslateService,
        private dialogService: PepDialogService,
        private listenersService: TransactionEventsService,
        private blockLoaderService: PepAddonBlockLoaderService,
        private viewContainerRef: ViewContainerRef,
        private router: Router,
        private activeRoute: ActivatedRoute) { }

    ngOnInit() {
        //this.item = this.incoming.Item;
        this.listenersService.addonUUID = this.activeRoute.snapshot.params.addon_uuid;
        this.itemKey = this.activeRoute.snapshot.params.key;
        if (this.router['formData']) {
            this.formData = this.router['formData'];
            this.item = this.formData.Item;
            this.isFormValid = this.formData.Mode === 'Edit'
        }
        else {
            this.listenersService.getListenerByKey(this.itemKey).then(obj => {
                if (obj) {
                    this.formData = {
                        Item: obj,
                        Mode: 'Edit'
                    }
                    this.item = obj;
                    this.isFormValid = true;
                }
                else {
                    this.formData = {
                        Mode: 'Add',
                        Item: {
                            Active: true,
                            AtdID: '',
                            Description: '',
                            EventKey: 'PreLoadTransactionScope',
                            Group: 1,
                            Key: this.itemKey,
                            Name: '',
                            RunScriptData: {},
                            Timing: 'Before'
                        }
                    }
                    this.item = this.formData.Item;
                }
            }).catch(err => {
                debugger;
                if (err instanceof Error) {
                    if (err.message.indexOf('Object ID does not exist') > 0) {
                        this.formData = {
                            Mode: 'Add',
                            Item: {
                                Active: true,
                                AtdID: '',
                                Description: '',
                                EventKey: 'PreLoadTransactionScope',
                                Group: 1,
                                Key: this.itemKey,
                                Name: '',
                                RunScriptData: {},
                                Timing: 'Before'
                            }
                        }
                        this.item = this.formData.Item;
                    }
                }
            })
        }

        this.listenersService.getTypes().then(types => {
            this.transactionTypesOptions = types;
            this.itemLoaded = true;
        })
    }

    onValueChanged($event) {
        console.log($event);
    }

    nameChanged($event) {
        this.isFormValid = $event && $event != '';
    }

    onFieldClick($event) {
        console.log($event);
    }

    goBack() {
        this.router.navigate(['..'], {
            relativeTo: this.activeRoute,
            queryParamsHandling: 'preserve'
        })
    }

    async save() {
        try {
            await this.listenersService.upsertListeners(this.item);
            this.goBack();
        }
        catch (err) {
            const operation = this.formData.Mode === 'Add' ? this.translate.instant('Create') : this.translate.instant('Update')
            const dataMsg = new PepDialogData({
                title: this.translate.instant('Events_SaveFailed_Title', {Operation: operation}),
                actionsType: 'close',
                content: this.translate.instant('Events_SaveFailed_Content', {Operation: operation, Field: this.item.Name})
            });
            this.dialogService.openDefaultDialog(dataMsg);
        }
    }

    openPicker() {
        this.hostObject = {
            runScriptData: this.item.RunScriptData,
            fields: {
                TransactionUUID: {
                    Type: 'String'
                },
                ItemUUID: {
                    Type: 'String'
                },
            }
        }
        // if(this.item.EventKey === 'PreLoadTransactionScope' || this.item.EventKey === 'OnLoadTransactionScope') {
        //     this.hostObject.fields['TansactionUUID'] = {
        //         Type: 'String'
        //     }
        // }
        // else {
        //     this.hostObject.fields['ItemUUID'] = {
        //         Type: 'String'
        //     }
        // }
        const dialogRef = this.blockLoaderService.loadAddonBlockInDialog({
            container: this.viewContainerRef,
            name: 'ScriptPicker',
            hostObject: this.hostObject,
            hostEventsCallback: (event) => {
                console.log(event);
                if (event.action === 'script-picked') {
                    this.item.RunScriptData = event.data.runScriptData;
                }
                dialogRef.close();
            }
        })
    }
}
