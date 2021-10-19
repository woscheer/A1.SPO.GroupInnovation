import { sp } from '@pnp/sp/presets/all';
import { IItem } from "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";

import { IDropdownOption, IFacepilePersona, IPersonaProps, TooltipHost } from "office-ui-fabric-react";

import { BaseService } from './baseService';
import { LogHelper, ListTitles, StandardFields, IServicePartnerFields, IOpCoStatusFields } from 'utilities';
import { IBaseItem, IServicePartnerItem, IOpCoStatusItem } from 'models';
import { truncate } from '@microsoft/sp-lodash-subset';

export class ListService extends BaseService {


    private listServicePartner = ListTitles.SERVICE_PARTNER;
    private listOpCoStatus = ListTitles.OPCOSTATUS;

    private selectColumnsServicePartners: string[] = [
        StandardFields.ID,
        StandardFields.TITLE,
        IServicePartnerFields.DESCRIPTION_4_REPORT,
        IServicePartnerFields.SHORTLIST,
    ];

    private selectColumnsOpCoStatus: string[] = [
        StandardFields.ID,
        StandardFields.TITLE,
        IOpCoStatusFields.OPCOSTATUS,
        IOpCoStatusFields.SERVICEPARTNERID,
        IOpCoStatusFields.OPCOCOMMENT,
        IOpCoStatusFields.OPCOICONURL,
        IOpCoStatusFields.OPCOIMAGEURLSTORAGE
    ];

    private expandColumnsOpCoStatus: string[] = [
        IOpCoStatusFields.SERVICEPARTNER,
    ];

    public async getServicePartners(): Promise<IServicePartnerItem[]> {
        LogHelper.verbose(this.constructor.toString(), 'Get Service Partners', ``);

        let foundItems: IServicePartnerItem[] = [];
      
        let spItems: any = await sp.web.lists.getByTitle(this.listServicePartner).items
                            .select(this.selectColumnsServicePartners.join(','))
                            .filter('Shortlist eq 1')
                            .orderBy(StandardFields.TITLE, true)
                            .getAll()
                            .catch(e => {
                                super.handleHttpError('getServicePartners', e);
                                throw e;
                            });
        
        console.log (`${spItems.length} items found`);
        
        let childRequests: Promise<IOpCoStatusItem[]>[] = []; 
        spItems.forEach( (item) => {
            let servicePartner = this.mapServicePartner(item);
            childRequests.push(this.getOpCoStati4ServicePartner(servicePartner));
            foundItems.push(servicePartner);
        });

        await Promise.all(childRequests);

        return foundItems;
    }

    public async getOpCoStati4ServicePartner(servicePartner: IServicePartnerItem): Promise<IOpCoStatusItem[]> {
        LogHelper.verbose(this.constructor.toString(), 'Get OpCoStati', ` for ServicePartner with id: ${servicePartner.id}`);

        let spItems:any = await sp.web.lists.getByTitle(this.listOpCoStatus).items
                .select(this.selectColumnsOpCoStatus.join(','))
                .expand(this.expandColumnsOpCoStatus.join(','))
                .filter(`ServicePartner/ID eq '${servicePartner.id}'`)
                //.top(top)
                //.orderBy(StandardFields.TITLE, true)
                .getAll()
                .catch(e => {
                    super.handleHttpError('getServicePartners', e);
                    throw e;
                });
        
        spItems.forEach( (item) => {
            let opcoItem = this.mapOpCoItem(servicePartner, item);
        });
        

        console.log (`${spItems.length} items found for ${servicePartner.title}`);        

        return spItems;
    }

    public async getProfilePhoto(userId): Promise<string> {
        let photoUrl: string = undefined;

        const profile: any = await sp.profiles.getPropertiesFor(userId)
                                    .catch(e => {
                                        super.handleHttpError('getProfilePhoto', e);
                                        throw e;
                                    });
        if (profile) {
            profile.UserProfileProperties.forEach((property, index) => {
                if (!photoUrl && property.Key === 'PictureURL') {
                    photoUrl = property.Value;
                }
              });
        }
        
        return photoUrl;                   
    }

    private mapServicePartner(item: any): IServicePartnerItem {
        // Map Base Properties (id, created/modified info)
        let base = super.mapBaseItemProperties(item);

        let servPartnerItem: IServicePartnerItem = {
            ...base,
            shortDescriptionReport: item[IServicePartnerFields.DESCRIPTION_4_REPORT],
            shortList: item[IServicePartnerFields.SHORTLIST],
            detailItems: [],
        };

        return servPartnerItem;
    }

    private mapOpCoItem(parentItem: IServicePartnerItem, item: any): IOpCoStatusItem {
        // Map Base Properties (id, created/modified info)
        let base = super.mapBaseItemProperties(item);

        let opcoItem: IOpCoStatusItem = {
            ...base,
            status: item[IOpCoStatusFields.OPCOSTATUS],
            imageUrl: item[IOpCoStatusFields.OPCOICONURL],
            imageUrlStorage: item[IOpCoStatusFields.OPCOIMAGEURLSTORAGE],
            comment: item[IOpCoStatusFields.OPCOCOMMENT],
            serviePartnerId: parentItem.id,
        };

        parentItem.detailItems.push(opcoItem);

        return opcoItem;
    }

    public async getChoices(fieldTitle: string): Promise<String[]> {
        LogHelper.verbose(this.constructor.toString(), 'getChoices for field', `[field:${fieldTitle}]`);

        let choices: any = await sp.web.lists.getByTitle(this.listServicePartner).fields
                    .getByInternalNameOrTitle(fieldTitle)
                    .select('Choices')
                    .get();

        let mappedChoices: string[] = [];
        for(const ch of choices.Choices) {
            mappedChoices.push(ch);
        }            

        console.log(`${fieldTitle} fetched ${mappedChoices.length}`);   
        return mappedChoices;

    }

}