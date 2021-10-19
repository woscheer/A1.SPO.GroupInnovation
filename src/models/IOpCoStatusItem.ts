import { IBaseItem } from './IBaseItem';

export interface IOpCoStatusItem extends IBaseItem {
    serviePartnerId: number;
    status: string;
    imageUrl: string;
    comment: string;
    imageUrlStorage: string;
}