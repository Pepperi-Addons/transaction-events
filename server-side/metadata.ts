import { AddonDataScheme, Relation } from '@pepperi-addons/papi-sdk';
import config from '../addon.config.json';

export const AtdRelation: Relation = 
{   //meta data for realtion of type NgComponent
    RelationName: "TransactionTypeListTabs",
    AddonUUID: config.AddonUUID,
    Name:"TransationEvents",
    Description:"Events",
    SubType: "NG11",
    ModuleName: "TransactionEventsModule",
    ComponentName: "TransactionEventsComponent",
    Type:"NgComponent",
    AddonRelativeURL:"events"
}
