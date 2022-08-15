import { Relation } from '@pepperi-addons/papi-sdk';
import config from '../addon.config.json';

const relationName = "TransactionEvents";

export const AtdRelation: Relation = 
{   //meta data for realtion of type NgComponent
    RelationName: "TransactionTypeListTabs",
    AddonUUID: config.AddonUUID,
    Name:relationName,
    Description:"Events",
    SubType: "NG14",
    ModuleName: `${relationName}Module`,
    ComponentName: `${relationName}Component`,
    Type:"NgComponent",
    AddonRelativeURL:"events",
    ElementsModule: 'WebComponents',
    ElementName: `transactions-element-${config.AddonUUID}`,
}

export const SettingsRelation: Relation = 
{   //meta data for realtion of type NgComponent
    RelationName: "SettingsBlock",
    GroupName: "Sales Activities",
    SlugName: "events",
    AddonUUID: config.AddonUUID,
    Name:relationName,
    Description:"transaction events",
    SubType: "NG14",
    ModuleName: `${relationName}Module`,
    ComponentName: `${relationName}Component`,
    Type:"NgComponent",
    AddonRelativeURL:"events",
    ElementsModule: 'WebComponents',
    ElementName: `settings-element-${config.AddonUUID}`,
}
