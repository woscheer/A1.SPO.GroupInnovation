import { sp } from '@pnp/sp';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { HttpRequestError } from '@pnp/odata';

import { LogHelper } from 'utilities';
import { IBaseItem } from 'models';


export class BaseService {

    public currentUser: string = undefined;

    constructor (public context: WebPartContext) {
        sp.setup({
            spfxContext: this.context
          });
        console.log('sp context initialized');
        this.currentUser = this.context.pageContext.user.email;
    }

    public handleHttpError(methodName: string, error: HttpRequestError): void {
        this.logError(methodName, error);
    }

    public logError(methodName: string, error: Error) {
        LogHelper.exception(this.constructor.toString(), methodName, error);
    }

    public mapBaseItemProperties(sourceItem: any): IBaseItem {
        if (sourceItem !== undefined && sourceItem !== null) {
            return {
                id: sourceItem.ID,
                title: sourceItem.Title,
                createdDate: sourceItem.Created !== null ? new Date(sourceItem.Created) : null,
                modifiedDate: sourceItem.Modified !== null ? new Date(sourceItem.Modified) : null,
                author: sourceItem.Author !== null ? this.mapPersonaProps(sourceItem.Author) : null,
                editor: sourceItem.Editor !== null ? this.mapPersonaProps(sourceItem.Editor) : null,
                etag: sourceItem.__metadata ? sourceItem.__metadata.etag : new Date().toISOString(),
            };
        }

        return { id: undefined };
    }

    public mapPersonaProps(item: any): IPersonaProps | null {
        // Note it's okay if the lookup passed in does not have all these properties but these below are all the 'possible ones' we might use
        if (item && item.Name) {
            let persona: IPersonaProps = {};
            persona.id = item.Name;
            persona.text = item.Title;
            persona.secondaryText = item.JobTitle;
            return persona;
        }
        else {
            return null;
        }
    }

}