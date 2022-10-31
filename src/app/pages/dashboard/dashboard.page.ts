import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController, AlertController, ToastController, MenuController } from '@ionic/angular';
import { CommonUtils } from './../../services/common-utils/common-utils';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { tap } from 'rxjs/operators';
import { IntlService } from '@progress/kendo-angular-intl';
import { LegendLabelsContentArgs } from '@progress/kendo-angular-charts';


declare var $ :any; //jquary declear

/* tslint:disable */ 
@Component({
  selector: 'app-dashboard',
templateUrl: './dashboard.page.html',
styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  
  main_url = environment.apiUrl;
  file_url = environment.fileUrl;


  // variable declartion section
  model: any = {};
  isListLoading = false;
  page = 1;
  noDataFound = true;
  fetchItems;
  tableHeaderData;
  tableHeaderDataDropdown;
  current_url_path_name;
  
  private dashboardDataSubscribe: Subscription;
  private tableDataSubscribe: Subscription;
  
  parms_action_id;
  listing_view_url;
  viewLoadData;
  viewData;
  dashboardData;
  dashboardDataChartColor = [];
  get_user_dtls;

  constructor(
    private activatedRoute : ActivatedRoute,
    private router: Router,
    private http : HttpClient,
    private authService: AuthService,
    private commonUtils : CommonUtils,
    public menuCtrl: MenuController,
    private intl: IntlService
  ) { 
    this.labelContent = this.labelContent.bind(this);
  }

  public labelContent(args: LegendLabelsContentArgs): string {
    return `${args.dataItem.name}: ${args.dataItem.value}`;
  }
  // pager object
  pager: any = {};
  // paged items
  pageItems: any[];

  listAlldata;
  curentDate;
  setStartdate;

  // ------ init function call start -------
  commonFunction(){
    
    // User detailsls get
    this.authService.globalparamsData.subscribe(res => {
      if(res != null || res != undefined){
        this.get_user_dtls = res.user;
        console.log('this.get_user_dtls aaa11 >>>>>>>>>>', this.get_user_dtls);
      }
    });
    
    // view page url name
    this.listing_view_url = 'get-dashbord?emp_id='+this.get_user_dtls.emp_id ;

    // view data call   
    this.dashboardDataSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res DASHBOARD >>>>>>>>>>>>>>>>>>>.. >', res);
      this.dashboardDataChartColor = [];
      if(res){

        // view page url name
        
      }
    })

    let curentDate = new Date();
    this.setStartdate = moment(curentDate).format('DD/MM/YYYY');
    setInterval(() => {
      this.curentDate = new Date();
    }, 1);
    this.viewTableData();
  }

  ngOnInit() {
    // menu hide
    this.menuCtrl.enable(true);
  }

  // ion View Will Enter call
  ionViewWillEnter() {
    this.commonFunction();
  }

  // ================== view data fetch start =====================
    viewPageData(_item){
      console.log();
      this.viewLoadData = true;
      this.dashboardDataSubscribe = this.http.get(this.listing_view_url+'&details_type='+_item).subscribe(
        (res:any) => {
          this.viewLoadData = false;
          console.log("view data  res -------------------->", res.return_data);
          if(res.return_status > 0){
            this.viewData = res.return_data;
            this.dashboardData = res.return_data;
              if(res.return_data.dashboard){
                res.return_data.dashboard.forEach(element => {
                  this.dashboardDataChartColor.push(element.color);
                });
              }
              console.log('DASHBOARD CHART COLOR => ',  this.dashboardDataChartColor);
          }
        },
        errRes => {
          this.viewLoadData = false;
        }
      );
    }
  // view data fetch end

  // --------- View Table Data --------- 
  viewTableLoadData = false;
  tableData: any;
  socialData: any;
  cardData: any;
  viewTableData(){
    this.viewTableLoadData = true;
    this.tableDataSubscribe = this.http.get(`dashboard`).subscribe(
      (res:any) => {
        this.viewTableLoadData = false;
        console.log("view Table data res -------------------->", res.return_data.task_data);
        if(res.return_status > 0){
          this.tableData = res.return_data.task_data;
          this.socialData = res.return_data.social_post;
          this.cardData = res.return_data.cards_data;
        }
      },
      errRes => {
        this.viewTableLoadData = false;
      }
    );
  }

  // --------- View Table Data --------- 

  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.dashboardDataSubscribe !== undefined){
        this.dashboardDataSubscribe.unsubscribe();
      }
      if(this.tableDataSubscribe !== undefined){
        this.tableDataSubscribe.unsubscribe();
      }
    }
  // destroy subscription end
}
  

