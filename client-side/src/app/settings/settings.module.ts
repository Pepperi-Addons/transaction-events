import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { PepAddonService } from '@pepperi-addons/ngx-lib';

import { config } from '../addon.config';

import { SettingsComponent } from '.';
import { SettingsRoutingModule } from './settings.routes';
import { TransactionEventsModule } from '../events';

@NgModule({
    declarations: [
        SettingsComponent
    ],
    imports: [
        SettingsRoutingModule,
        CommonModule,
        TransactionEventsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
    ],
})

export class SettingsModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
