import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ListService } from 'services';

export interface IA1ServPartnerReportProps {
  description: string;
  context: WebPartContext;
  service: ListService;
}
