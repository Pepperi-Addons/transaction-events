import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import { TranslateService } from '@ngx-translate/core';

import { TransactionEventsService } from "../transation-events.service";
import { PepDialogData, PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { TransactionEventListeners } from "@pepperi-addons/events-shared";
import { FormMode, EventFormData } from '../../entities';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'addon-block',
    templateUrl: './transaction-events-form.component.html',
    styleUrls: ['./transaction-events-form.component.scss']
})
export class TransactionEventsFormComponent implements OnInit {

    isFormValid: boolean = false;
    item: TransactionEventListeners = null;
    
    constructor (private dialogRef: MatDialogRef<TransactionEventsFormComponent>,
        private translate: TranslateService,
        private dialogService: PepDialogService,
        private listenersService: TransactionEventsService,
        @Inject(MAT_DIALOG_DATA) public incoming: EventFormData) { }

    ngOnInit() {
        this.item = this.incoming.Item;
    }

    onValueChanged($event) {
        console.log($event);
    }

    onFormValidation($event) {
        this.isFormValid = $event;
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
}
