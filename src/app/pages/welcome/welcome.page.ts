import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController, AlertController, ToastController, MenuController } from '@ionic/angular';
import { CommonUtils } from './../../services/common-utils/common-utils';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';

declare var $ :any; //jquary declear

/* tslint:disable */ 

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})

export class WelcomePage implements OnInit, OnDestroy {
  
  main_url = environment.apiUrl;
  file_url = environment.fileUrl;


  // ----- pie chart start -----------
  
// ----- pie chart end -----------

  // variable declartion section
  model: any = {};
  isListLoading = false;
  page = 1;
  noDataFound = true;
  fetchItems;
  tableHeaderData;
  tableHeaderDataDropdown;
  current_url_path_name;
  parms_action_id;
  viewLoadData;
  viewData;
  dashboardData;
  dashboardDataChartColor = [];
  get_user_dtls;
  form_api;

  lat;
  lng;
  zoom;
  origin;
  destination

  private userDataSubscribe: Subscription;

  constructor(
    private activatedRoute : ActivatedRoute,
    private router: Router,
    private http : HttpClient,
    private authService: AuthService,
    private commonUtils : CommonUtils,
    public menuCtrl: MenuController,
    private dialog: MatDialog
  ) { }

  // pager object
  pager: any = {};
  // paged items
  pageItems: any[];

  listAlldata;
  curentDate;
  setStartdate;

  // ------ init function call start -------
  commonFunction(){
    // get active url name
    this.current_url_path_name =  this.router.url.split('/')[1] + 'ColumnSelect';
    this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);

    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');

    // menu hide
    this.menuCtrl.enable(true);

    // User detailsls get
    this.authService.globalparamsData.subscribe(res => {
      if(res != null || res != undefined){
        this.get_user_dtls = res;
        console.log('this.get_user_dtls aaa11 >>>>>>>>>>', this.get_user_dtls);
      
      }
    });

    
    
    // Get User details start
    this.userDataSubscribe = this.http.get(this.form_api).subscribe(
      (res:any) => {
        console.log("User data  res ><<<<<<<<<<<<", res.return_data);
        if(res.return_status > 0){
          
        }
      },
      errRes => {
      }
    );
    // Get user details end


    let curentDate = new Date();
    this.setStartdate = moment(curentDate).format('DD/MM/YYYY');

    setInterval(() => {
      this.curentDate = new Date();
    }, 1);
    
  }

  ngOnInit() {
    
  }

  // ion View Will Enter call
  ionViewWillEnter() {
    this.commonFunction();
  }

  // Office in start
  getOfficeInfo(_info){
    console.log('Click in', _info);

    this.getUserLocation();    
    // Date and time
    console.log('Current date>>',  moment(this.curentDate).format('YYYY-MM-DD'));
    console.log('Current time>>',  moment(this.curentDate).format('h:mm a'));
    
  }

  

  // -----------------Get current location start-----------------
  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 16;
        console.log("position", position);
        console.log("this.lat", this.lat);
        console.log("this.lng", this.lng);
      });
    }
  }

  async getDirection() {
    if (typeof this.lat === "undefined" || typeof this.lng === "undefined" || typeof this.zoom === "undefined") {
      await this.getUserLocation();
    }
    this.origin = { lat: this.lat, lng: this.lng };
    
    this.destination = { lat: 22.482124799999998, lng: 88.3359744 };
    console.log(this.origin);
  }
  // -----------------Get current location end


  // open description
  openDescription(event, _item, _items){
    _item.isOpenDescription = !_item.isOpenDescription;

    
  }


  /* downloadReport start*/
  downloadReport() {
    location.href = 'https://marketing-crm.bongtechsolutions.com/admin/upload/csv/user_data.csv';
  }
  /* downloadReport end*/

  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.userDataSubscribe !== undefined ){
        this.userDataSubscribe.unsubscribe();
      }
    }
  // destroy subscription end
}