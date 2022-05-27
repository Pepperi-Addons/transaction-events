import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewContainerRef } from "@angular/core";
import { KeyValuePair, PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import { TranslateService } from '@ngx-translate/core';

import { TransactionEventsService } from "../transation-events.service";
import { PepDialogData, PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader'
import { EventKeys, EventTimings, TransactionEventListeners } from "@pepperi-addons/events-shared";
import { FormMode, EventFormData } from '../../entities';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'addon-block',
    templateUrl: './transaction-events-form.component.html',
    styleUrls: ['./transaction-events-form.component.scss']
})
export class TransactionEventsFormComponent implements OnInit {

    isFormValid: boolean = this.incoming.Mode === 'Edit';
    item: TransactionEventListeners = null;

    eventTypeOptions = Object.keys(EventKeys).map(item => {
        return {
            key: item,
            value: item
        }
    });

    eventTimingOptions = Object.keys(EventTimings).map(item => {
        return {
            key: item,
            value: item
        }
    })

    hostObject;
    
    constructor (private dialogRef: MatDialogRef<TransactionEventsFormComponent>,
        private translate: TranslateService,
        private dialogService: PepDialogService,
        private listenersService: TransactionEventsService,
        private blockLoaderService: PepAddonBlockLoaderService,
        private viewContainerRef: ViewContainerRef,
        @Inject(MAT_DIALOG_DATA) public incoming: EventFormData) { }

    ngOnInit() {
        this.item = this.incoming.Item;
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

    close() {
        this.dialogRef.close();
    }

    async save() {
        try {
            await this.listenersService.upsertListeners(this.item)
            this.dialogRef.close(true);
        }
        catch (err) {
            const operation = this.incoming.Mode === 'Add' ? this.translate.instant('Create') : this.translate.instant('Update')
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

            }
        }
        if(this.item.EventKey === 'PreLoadTransactionScope' || this.item.EventKey === 'OnLoadTransactionScope') {
            this.hostObject.fields['TansactionUUID'] = {
                Type: 'String'
            }
        }
        else {
            this.hostObject.fields['ItemUUID'] = {
                Type: 'String'
            }
        }
        const dialogRef = this.blockLoaderService.loadAddonBlockInDialog({
            container: this.viewContainerRef,
            name: 'ScriptPicker',
            hostObject: this.hostObject,
            hostEventsCallback: (event) => {
                console.log(event);
                this.item.RunScriptData = event;
                dialogRef.close();
            }
        })
    }
}
