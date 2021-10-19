
import { LogHelper, ListTitles, StandardFields, IServicePartnerFields, IOpCoStatusFields } from 'utilities';
import { IServicePartnerItem, IOpCoStatusItem } from 'models';
import  { Stati} from 'utilities';

export class MockService {

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
        IOpCoStatusFields.OPCOCOMMENT,
        IOpCoStatusFields.OPCOICONURL,
        IOpCoStatusFields.OPCOIMAGEURLSTORAGE
    ];

    private expandColumnsOpCoStatus: string[] = [
        IOpCoStatusFields.SERVICEPARTNER,
    ];

    public async getServicePartners(): Promise<IServicePartnerItem[]> {
        LogHelper.verbose(this.constructor.toString(), 'Get Service Partners', ``);

        let spItems: IServicePartnerItem[] = [];
      
        let item1: IServicePartnerItem = { id:1, title:'One.Pin', shortList: true, shortDescriptionReport:'One.Pin ShrtDesc', detailItems:[] };
        let item2: IServicePartnerItem = { id:1, title:'Toonimo', shortList: true, shortDescriptionReport:'Toonimo ShrtDesc', detailItems:[] };
        let item3: IServicePartnerItem = { id:1, title:'Lifemote', shortList: true, shortDescriptionReport:'LifeMote ShrtDesc', detailItems:[] };
        let item4: IServicePartnerItem = { id:1, title:'Buyapowa', shortList: true, shortDescriptionReport:'Buyapowa ShrtDesc', detailItems:[] };

        this.getOpCoStati4ServicePartner(item1);
        this.getOpCoStati4ServicePartner(item2);
        this.getOpCoStati4ServicePartner(item3);
        this.getOpCoStati4ServicePartner(item4);

        spItems.push(item1);
        spItems.push(item2);
        spItems.push(item3);
        spItems.push(item4);

        console.log (`${spItems.length} items found`);
        
        await Promise.resolve();
        
        return spItems;
    }

    public getOpCoStati4ServicePartner(servicePartner: IServicePartnerItem): void {
        LogHelper.verbose(this.constructor.toString(), 'Get OpCoStati', ` for ServicePartner with id: ${servicePartner.id}`);

        
        let imagePrefix = 'https://a1g.sharepoint.com/sites/o365spo_GP_000059/Images1/';
        let imageStoragePrefix = 'https://svpartnersimages.blob.core.windows.net/sp-images/';
        let opCos = ['AUT','SLO','CRO','BUL','MKD','SRB','BEL'];

        opCos.forEach( (op) => {
            let opItem: IOpCoStatusItem = {
                comment: `Test for ${op}`,
                serviePartnerId: servicePartner.id,
                imageUrl: `${imagePrefix}${op}_FALSE_FALSE_.png`,
                imageUrlStorage: `${imageStoragePrefix}${op}_FALSE_FALSE_.png`,
                status: `${Stati.stati[Math.floor(Math.random() * Stati.stati.length)]}`
            };
            servicePartner.detailItems.push(opItem);
        });

        let spItems: IOpCoStatusItem[] = null;
    }


}