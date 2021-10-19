import { IBaseItem } from './IBaseItem';
import { IOpCoStatusItem } from './IOpCoStatusItem';

export interface IServicePartnerItem extends IBaseItem {
    shortDescriptionReport: string;
    shortList: boolean;
    detailItems: IOpCoStatusItem[];
}