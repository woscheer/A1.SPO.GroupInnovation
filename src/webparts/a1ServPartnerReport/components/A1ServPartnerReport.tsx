import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { List } from 'office-ui-fabric-react';
import { Environment, EnvironmentType} from '@microsoft/sp-core-library';

import styles from './A1ServPartnerReport.module.scss';
import { IA1ServPartnerReportProps } from './IA1ServPartnerReportProps';
import { IOpCoStatusItem, IServicePartnerItem } from 'models';
import { ListService } from 'services/listService';
import { HeaderText } from 'utilities';
import { escape } from '@microsoft/sp-lodash-subset';

import { MockService } from 'services';

interface IReportState {
  isLoading: boolean;
  items: IServicePartnerItem[];
}

export default class A1ServPartnerReport extends React.Component<IA1ServPartnerReportProps, IReportState> {
  
  private _service: ListService;
  private _context: WebPartContext;

  constructor(props: IA1ServPartnerReportProps) {
    super(props);

    this._service = props.service;
    this._context = props.context;

    this.state = {
      isLoading: false,
      items: [],
    };
  }

  public async componentDidMount() {
    this.setState({ isLoading: true });
    console.log('componentDidMount');
    let items: IServicePartnerItem[]; 
    
    if (Environment.type != EnvironmentType.Local)
      items = await this._service.getServicePartners();
    else
      items = await (new MockService()).getServicePartners();

    items = items.sort((a,b) => (a.title > b.title)?1:-1);

    console.log(`${items.length} items in component available!`);
    this.setState({ items:items, isLoading: false });
  }

  private formatDate = (): string => {
    let date: Date = new Date();
   
      let yyyy = date.getFullYear().toString();
      let mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
      let dd = date.getDate().toString();
      let hh = date.getHours().toString();
      let mins = date.getMinutes().toString();
      //return yyyy + (mm[1] ? mm : "0" + mm[0]); //+ (dd[1] ? dd : "0" + dd[0]); // padding
      return (dd[1] ? dd : "0" + dd[0]) + "." + (mm[1] ? mm : "0" + mm[0]) + "." + yyyy; //+ " " + (hh[1] ? hh : "0" + hh[0]) + ":" + (mins[1] ? mins : "0" + mins[0]); // padding
  }

  private onRenderDetailItem = (item: IOpCoStatusItem): JSX.Element => { 
    return (
        <>
          {Environment.type != EnvironmentType.SharePoint
            ? <img className={styles.opcoimg} src={item.imageUrlStorage} />
            : <img className={styles.opcoimg} src={item.imageUrl} />
          }
        </>
    );
  }

  private extractImageUrls  = (item:IServicePartnerItem, status: string): JSX.Element => { 
      let opcoItemsWithStatus: IOpCoStatusItem[] = this.getOpCoItemForStatus(item, status);
      
      return (
        <div>
          {opcoItemsWithStatus.map((it: IOpCoStatusItem): JSX.Element => {
              return (this.onRenderDetailItem(it));
            })
          }
        </div>
      );
  }

  private getOpCoItemForStatus = (item:IServicePartnerItem, status: string): IOpCoStatusItem[] => {

    return item.detailItems.filter( (obj:IOpCoStatusItem) => {
      return (obj.status === status && obj.title != 'Group');
    }).sort((a,b) => (a.title > b.title)?1:-1);

  }
  
  public render(): React.ReactElement<IA1ServPartnerReportProps> {
    let headerUrl:string = 'https://svpartnersimages.blob.core.windows.net/sp-images/SPReportHeader.JPG';
    if (Environment.type != EnvironmentType.Local)
      headerUrl = 'https://a1g.sharepoint.com/:i:/r/sites/o365spo_GP_000059/Images1/SPReportHeader.PNG';
  
     
    return (
      <div className={ styles.a1ServPartnerReport }>
          { !this.state.isLoading ? ( // has tasks ?
              <div className={styles.container}>
                <div className={styles.reportHeader}>
                  <h1>Innovation Community Partner Status Overview - {this.formatDate()}</h1>
                </div>
                <table>
                  <thead>
                    <tr>
                        <td>Partner</td>
                        <td colSpan={5}><img className={styles.headerimg} src={headerUrl} /></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>{HeaderText.Assessment}</td>
                        <td>{HeaderText.Onboarding}</td>
                        <td>{HeaderText.POC}</td>
                        <td>{HeaderText.Launched}</td>
                        <td>{HeaderText.Delisted}</td>
                    </tr>
                  </thead>

                  <tbody>

                  {this.state.items.map((it: IServicePartnerItem) => {
                      return (<tr>
                          <td>
                            <div className={styles.itemHeader}>{it.title}</div>
                            <div className={styles.itemDescription}>{it.shortDescriptionReport}</div>
                          </td>
                          <td>
                            {this.extractImageUrls(it, 'Assessment')}
                          </td>
                          <td>
                            {this.extractImageUrls(it, 'Partner Onboarding')}
                          </td>
                          <td>
                            {this.extractImageUrls(it, 'POC')}
                          </td>
                          <td>
                            {this.extractImageUrls(it, 'Launched (product is live)')}
                          </td>
                          <td>
                            {this.extractImageUrls(it, 'Delisted')}
                          </td>
                        </tr>);
                    })
                  }

                  </tbody>
                </table>
              </div>
              
            ) : (
              <div>
                <h1>Loading</h1>
              </div>
            )}
      </div>
    );
  }
}




/*


<tr>
                      <td>Partner 1</td>
                      <td>
                        <img className={styles.opcoimg} src='https://svpartnersimages.blob.core.windows.net/sp-images/AUT_FALSE_FALSE.png' />
                        <img className={styles.opcoimg} src='https://svpartnersimages.blob.core.windows.net/sp-images/CRO_TRUE_FALSE.png' />
                        <img className={styles.opcoimg} src='https://svpartnersimages.blob.core.windows.net/sp-images/SLO_TRUE_FALSE.png' />
                      </td>
                      <td></td>
                      <td>
                        <img className={styles.opcoimg} src='https://svpartnersimages.blob.core.windows.net/sp-images/BEL_FALSE_TRUE.png' />
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Partner 2</td>
                      <td>
                        <img className={styles.opcoimg} src='https://svpartnersimages.blob.core.windows.net/sp-images/SLO_FALSE_FALSE.png' />
                      </td>
                      <td>
                        <img className={styles.opcoimg} src='https://svpartnersimages.blob.core.windows.net/sp-images/AUT_FALSE_FALSE.png' />
                      </td>
                      <td>
                        <img className={styles.opcoimg} src='https://svpartnersimages.blob.core.windows.net/sp-images/BEL_FALSE_TRUE.png' />
                      </td>
                      <td>
                        <img className={styles.opcoimg} src='https://svpartnersimages.blob.core.windows.net/sp-images/CRO_FALSE_FALSE.png' />
                      </td>
                      <td>
                        <img className={styles.opcoimg} src='https://svpartnersimages.blob.core.windows.net/sp-images/SRB_FALSE_FALSE.png' />
                      </td>
                    </tr>




<div className={styles.divTable}>
                    <div className={styles.blueTable} >
                      <div className={styles.divTableHeading}>
                        <div className={styles.divTableRow}>
                          <div className={styles.divTableHead}>
                            <div className={styles.divTableHead}>head2 ghdgdhhd</div>
                            <div className={styles.divTableHead}> 
                              <img className={styles.headerimg} src='https://svpartnersimages.blob.core.windows.net/sp-images/SPReportHeader.JPG' />
                            </div>
                          </div>
                          
                        </div>
                      </div>
                      <div className={styles.divTableBody}>
                        <div className={styles.divTableRow}>
                          <div className={styles.divTableCell}>cell1_1</div>
                          <div className={styles.divTableCell}>cell2_1</div>
                          <div className={styles.divTableCell}>cell3_1</div>
                          <div className={styles.divTableCell}>cell4_1</div>
                        </div>
                        <div className={styles.divTableRow}>
                          <div className={styles.divTableCell}>cell1_2</div>
                          <div className={styles.divTableCell}>cell2_2</div>
                          <div className={styles.divTableCell}>cell3_2</div>
                          <div className={styles.divTableCell}>cell4_2</div>
                        </div>
                        <div className={styles.divTableRow}>
                          <div className={styles.divTableCell}>cell1_3</div>
                          <div className={styles.divTableCell}>cell2_3</div>
                          <div className={styles.divTableCell}>cell3_3</div>
                          <div className={styles.divTableCell}>cell4_3</div>
                        </div>
                        <div className={styles.divTableRow}>
                          <div className={styles.divTableCell}>cell1_4</div>
                          <div className={styles.divTableCell}>cell2_4</div>
                          <div className={styles.divTableCell}>cell3_4</div>
                          <div className={styles.divTableCell}>cell4_4</div>
                        </div>
                      </div>
                    </div>             
                  </div>       */
