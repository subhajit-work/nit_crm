import { Component, Renderer, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser'; //use for fabicon
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Subscription, observable } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { CommonUtils } from './services/common-utils/common-utils';
import { environment } from '../environments/environment';

/* tslint:disable */ 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  // variable define
  url_name;
  url_path_name;
  get_user_type;
  panelOpenState: boolean;
  userInfodDataLoading;
  private groupMenuDataSubscribe : Subscription;
  private sideMenuBarSubscribe: Subscription;
  private getProfileDataSubscribe: Subscription;
  
  menuPages = [];
  menuPagesList;
  menuPages2 = [];
  activeMenuHilight;
  selectedItemActive;
  parentSelectedIndex;
  childSelectedIndex;
  siteInfo : any;
  isActive : boolean = false;
  siteInfoLoading;
  get_user_dtls;
  viewData;
  sticky_url;
  sidebarData: any;
  emp_id: any;
  active: boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private activatedRoute : ActivatedRoute,
    private http : HttpClient,
    private authService : AuthService,
    public menuCtrl: MenuController,
    public renderer: Renderer2,
    public router : Router,
    private navCtrl: NavController,
    private commonUtils: CommonUtils, // common functionlity come here
    @Inject(DOCUMENT) private _document: HTMLDocument //use for fabicon
  ) {
    this.onSiteInformation();
  }

  /* Download apps start*/
  downloadApp() {
    location.href = 'https://www.marketing-crm.bongtechsolutions.com/bongtech.apk';
  }
  /* Download apps end*/

  ngOnInit(){
    // User detailsls get
    this.authService.globalparamsData.subscribe(res => {
      if(res != null || res != undefined){
        this.get_user_dtls = res.user;
        console.log('this.get_user_dtls aaa11 >>>>>>>>>>', this.get_user_dtls);
        this.emp_id = this.get_user_dtls.id;
        console.log('this.get_user_dtls employee Id>>>>>>>>>>', this.emp_id);
        this.sideMenuBar();
        this.getProfile();
      }
    });

  }

  /* Get profile data start */
  getProfile(){
    this.getProfileDataSubscribe = this.http.get('employee-details').subscribe(
      (res:any) => {
        console.log("getProfile data  res >", res.return_data);
        if(res.return_status > 0){
          
          if(res.return_data.office_in_data == null) {
            localStorage.setItem('employeeData', JSON.stringify({
              'office_in': null,
              'office_out': null
            }));
          }else {
            localStorage.setItem('employeeData', JSON.stringify({
              'office_in': res.return_data.office_in_data.office_in,
              'office_out': res.return_data.office_in_data.office_out
            }));
          }
        }
      },
      errRes => {
      }
    );
  }
  /* Get profile data end */

  sideMenuBar(){
    this.sideMenuBarSubscribe = this.http.get('get-menu').subscribe(
      (res:any) => {
        if(res.return_status > 0){
          console.log("sidemenubar_data>>>>>",res);
          this.sidebarData = res.return_data;
        }
      },
      errRes => {

      }
    );
  }

  listDetails(_Url_name, _id){
    console.log("Module Id>>>>>>>>>>",_id);
    for (let i = 0; i < this.sidebarData.length; i++) {
      if(this.sidebarData[i].module.id == _id){
        this.active = true;
        console.log("Module id....",_id);
        this.router.navigateByUrl(_Url_name+'/'+_id);
      }
    }
    
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      // user data call
      this.userInfoData();
      
      // ----get current active url name start---
        this.activatedRoute.url.subscribe(activeUrl => {
          this.url_name = window.location.pathname;
          console.log('this.url_name app.componet.ts @@@>>', this.url_name.split('/')[1]);
        })
      //get current active url name end

      // observable data for all page url name get
      this.commonUtils.pagePathNameAnywhereObsv.subscribe(pathRes => {
        this.url_path_name = pathRes;
      });
      
      
    });
  }
  //------------------- menu item show get_user_dtlsstart------------------------

  // menu data call
  mapped;
  userInfoData(){
    this.menuPages = [];
    this.userInfodDataLoading = false;
    this.authService.globalparamsData.subscribe(res => {
      console.log('componet.ts Toke store >>>>>>>>>>>>>>>111', res);
      this.menuPages = [];
    });
  }

  // group login menu data start
  group_map:any = [];
  groupMenuData(){
    this.userInfodDataLoading = true;
    this.group_map = [];
    this.groupMenuDataSubscribe = this.http.get('groupclient').subscribe(
      (res:any) => {
        console.log("group login view data  res =====================>", res.return_data.client);
        this.userInfodDataLoading = false;
        if(res.return_status > 0){
          this.menuPages = [];
          this.group_map = [];
          this.menuPagesList = res.return_data.client;
            res.return_data.client.forEach((val, ind) => {
              this.group_map = [
                {
                  'page_display_name': 'group_sub_name',
                  'page_url':	'/group-transaction-list',
                  'page_icon': 'list-box'
                }
              ];
              val.module_display_name = val.name;
              val.module_icon = 'list';
              this.menuPages.push({'value':val, 'pages':this.group_map});
            });
        }
      },
      errRes => {
        this.userInfodDataLoading = false;
      }
    );
  }

  closeModal() {
    console.log('Clicked');
    this.menuCtrl.toggle();
  }

  // sticky note open start
  openNote = false;
  openStickyNote(){
    console.log('openNote', this.openNote);
    if(this.openNote == false) {
      this.openNote = true;
    }else{
      this.openNote = false;
    }
  }
  
  // on click function call
  groupLoginData:any = {};
  onClickGroupItem( pIndex, cIndex, indentifire, _item, _itemsArray){
    this.commonUtils.onClickGroupIdentifire(indentifire);
    console.log('pIndex >', pIndex);
    console.log('indentifire >', indentifire);
    this.parentSelectedIndex = pIndex;
    this.childSelectedIndex = indentifire;
    this.isActive = !this.isActive;   
    this.groupLoginData = {
      'indentifire':indentifire,
      'item': _item,
      'itemsArray': _itemsArray
    }
    this.commonUtils.onClickGroupItemData(this.groupLoginData);
  }

  // ============site information get start =============
  site_path;
  site_href;
  site_href_split;
  site_path_split;
  site_url_name;
  onSiteInformation(){
    this.site_path = window.location.pathname;
    this.site_href = window.location.href;
    this.site_href_split = window.location.href.split('/')[1];
    this.site_path_split = window.location.pathname.split('/')[1];
    const parsedUrl = new URL(window.location.href);
    const baseUrl = parsedUrl.hostname;
    console.log('baseUrl> ', baseUrl); // this will print http://example.com or http://localhost:4200
    if(baseUrl == 'localhost' || baseUrl == '192.168.1.218'){
      this.site_url_name = 'https://www.marketing-crm.bongtechsolutions.com/';
    }else{
      this.site_url_name = window.location.href;
    }
    this.siteInfoLoading = true;
    // -----initializeApp----
    this.initializeApp();
    
  }
 
  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.sideMenuBarSubscribe !== undefined){
      this.sideMenuBarSubscribe.unsubscribe();
    }
    if(this.getProfileDataSubscribe !== undefined){
      this.getProfileDataSubscribe.unsubscribe();
    }
    if(this.groupMenuDataSubscribe !== undefined){
      this.groupMenuDataSubscribe.unsubscribe();
    }
  }
// ------------ destroy subscription end ----------

}
