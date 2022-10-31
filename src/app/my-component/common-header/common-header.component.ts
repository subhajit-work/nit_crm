import { Component, OnInit, OnDestroy, AfterViewInit, Injectable, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MenuController, Platform, AlertController, ModalController } from '@ionic/angular';
import { take, map, tap, delay, switchMap, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subscription, Subject, interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';
import { AddCommonModelPage } from '../../pages/modal/add-common-model/add-common-model.page';
import { AppComponent } from '../../app.component';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { LocationService } from '../../services/location/location-service.ts.service'

export interface Entry {
  created: Date;
  id: string;
}

export interface TimeSpan {
  hours: number;
  minutes: number;
  seconds: number;
}

@Injectable({
  providedIn: 'root'
})

/* tslint:disable */ 
@Component({
  selector: 'common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonHeaderComponent implements OnInit, OnDestroy {
  // private _globalparamsData = null;
  @Input() ProfileData: any;
  @Input() profilepath: any;
  private _globalparamsData = new BehaviorSubject(null);

  // get token session master as observable
  get globalparamsData(){
    return this._globalparamsData.asObservable();
  }

  // get token session master as a non observable
  public getTokenSessionMaster() {
    return this._globalparamsData.value;
  }
  
  get_user_dtls;
  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  form_api;

  lat;
  lng;
  zoom;
  origin;
  destination;
  model;
  getprofile_Url;
  
  oficeIn_Url: any;
  setStartdate: any;
  oficeOut_Url: any;

  private logoutDataSubscribe: Subscription;
  private editDataSubscribe: Subscription;
  private formSubmitSubscribe: Subscription;
  private taskDataSubscribe: Subscription;
  

  constructor(
    private authService: AuthService,
    private menuCtrl: MenuController,
    private http : HttpClient,
    private router: Router,
    private modalController : ModalController,
    private platform : Platform,
    private storage: Storage,
    private alertController : AlertController,
    private appComponent : AppComponent,
    private changeDetector: ChangeDetectorRef,
    private commonUtils: CommonUtils,
    private locationService: LocationService,
    ) { }

    entries: any =[];
    newId: string;
    office_in_data;
    office_out: any;
    text_office: string = "Office In";
    private destroyed$ = new Subject();

    commonfunction() {
      this.getUserLocation();

      this.authService.globalparamsData.subscribe(res => {
        if(res != null || res != undefined){
          this.get_user_dtls = res.user;
          console.log('this.get_user_dtls aaa11234 >>>>>>>>>>', this.get_user_dtls);
          
          this.office_in_data = JSON.parse(localStorage.getItem('employeeData'));
          console.log('Localstorage employeeData', this.office_in_data);
        }
      });
    }

  ngOnInit() {
    this.commonfunction()
    
  }

  // ------ Geolocation start ------
  count: number = 0;
  allowLocation() {
    console.log("hello Location ");
    this.locationService.getPosition()
    .then(pos => {
         console.log(`location service long and lati Positon....: long: ${pos.lng} lat: ${pos.lat}`);
         this.lng = pos.lng;
         this.lat = pos.lat;
         this.zoom = 16; 
         return;
    })
    .catch((error) => {
      console.log("catch all clear..", error);
        this.locationAlert(); 
    });   
  }

  async locationAlert(){
    const alert = await this.alertController.create({
      header: 'Access to location denied ',
      message: '<div class="d-flex"><img class="location-img" src="assets/images/location.png"><div>Allow access to the location service <span class="text-or-color">Or</span> open another browser.</div></div>', 
      backdropDismiss: false,
      cssClass: 'custom-location-alert',
      buttons: [{
        text: 'Ok',
        role: 'confirm',
        handler: () => {
          console.log("close")
        this.allowLocation();
        },
      }],
    });
    await alert.present();
  }

  // ------ Geolocation end ------
  
  ngAfterViewInit(){
    this.getUserLocation();
  }
  
  ionViewWillEnter(){
    this.commonfunction();
  }

  getProfile(){
    this.officeLoader = true;
    console.log("After ionView Will Enter....");
    //profile data call
    this.getprofile_Url='employee-details';
    this.editDataSubscribe = this.http.get(this.getprofile_Url).subscribe(
      (res:any) => {
        console.log("Profile data  res >", res.return_data);
        if(res.return_status > 0){
          // -------Profile data---------
          this.ProfileData = res.return_data.employee_data;
          this.profilepath = res.return_data.path;
          if(res.return_data.office_in_data == null){
            this.text_office = "Office In";
            console.log("office_in_data... Null");
            this.officeLoader = false;
            console.log('this.officeLoader ', this.officeLoader );
            localStorage.setItem('employeeData', JSON.stringify({
              'office_in': null,
              'office_out': null
            }));
            this.office_in_data = JSON.parse(localStorage.getItem('employeeData'));
          }else if(res.return_data.office_in_data != null){
            this.text_office = "Office Out";
            console.log("office_in_data...Not Null");
            this.officeLoader = false;
            console.log('this.officeLoader ', this.officeLoader );
            localStorage.setItem('employeeData', JSON.stringify({
              'office_in': res.return_data.office_in_data.office_in,
              'office_out': res.return_data.office_in_data.office_out
            }));
            this.office_in_data = JSON.parse(localStorage.getItem('employeeData'));
          }
        }
      },
      errRes => {
      }
    );
  }

  getUserLocation() {
    console.log("Get current location start");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 16;
        console.log("position", position);
        console.log("this.lat", this.lat);
        console.log("this.lng", this.lng);
      })
    }
    else{
      console.log("error location.....");
    }
  }

  async getDirection() {
    console.log('getDirection');
    
    if (typeof this.lat === "undefined" || typeof this.lng === "undefined" || typeof this.zoom === "undefined") {
      await this.getUserLocation();
    }
    this.origin = { lat: this.lat, lng: this.lng };
    this.destination = { lat: 22.482124799999998, lng: 88.3359744 };
    console.log('this.origin',this.origin);
  }

  menuEnable = true;
  toggleMenu() {
    this.menuEnable =! this.menuEnable;
    console.log('click menu button');
    this.menuCtrl.enable(this.menuEnable);
  }

  // onLogout
  loadingShow = false;
  onLogout(){
    console.log('logout..................');
    this.loadingShow = true;
    this.logoutDataSubscribe = this.http.get('logout').subscribe(
      (res:any) => {
        this.loadingShow = false;
        console.log("Edit data  res >", res.return_data);
        if(res.return_status > 0){
          this.authService.logout();
          this.storage.clear().then(() => {
            console.log('all stroage data cleared');
            this.router.navigateByUrl('/auth');
            this._globalparamsData = new BehaviorSubject(null);
             window.location.reload(); //working
          });
        }
      },
      errRes => {
        this.loadingShow = false;
      }
    );

    
  }

  async allertmethod(){
    const alert = await this.alertController.create({
      header: 'Alert ...!',
      message: "<img class='alert_img' src='assets/images/warning.gif'><div class='alert1'>No Address found!</div><div class='alert2'>**Please add an address.<div>",
      buttons: [
        {
          text: '',
          role: 'cancel',
          cssClass: 'popup-cancel-btn',
          handler: (blah) => {
          }
        }
      ]
    });
    await alert.present();
  }

  // goProfilePageUrl
  goProfilePageUrl(){
    this.router.navigateByUrl(`profile-view/${this.get_user_dtls.id}`);
  }

  //----get storage user data start---------
    get_global_params = this.authService.getTokenSessionMaster();
  // get storage user data start end


  // ..... task notification modal start ......
    async openModal(_identifier, _item, _items) {
      let task_notification_modal;
      if(_identifier == 'task_notification'){
        task_notification_modal = await this.modalController.create({
          component: AddCommonModelPage,
          cssClass: 'mymodalClass',
          componentProps: { 
            identifier: _identifier,
            modalForm_item: _item,
            modalForm_array: _items
          }
        });
      }
      
      // modal data back to Component
      task_notification_modal.onDidDismiss()
      .then((getdata) => {
        if(getdata.data == 'submitClose'){

        }
      });
      return await task_notification_modal.present();
    }
  // task notification modal end 

  // ..... change Password modal start ......
  async changePasswordOpenModal(_identifier, _item, _items) {
    // console.log('_identifier >>', _identifier);
    let change_password_modal;
    if(_identifier == 'change_password_modal'){
      change_password_modal = await this.modalController.create({
        component: AddCommonModelPage,
        cssClass: 'mymodalClass',
        componentProps: { 
          identifier: _identifier,
          modalForm_item: _item,
          modalForm_array: _items
        }
      });
    }
    
    // modal data back to Component
    change_password_modal.onDidDismiss()
    .then((getdata) => {
      if(getdata.data == 'submitClose'){

      }
    });
    return await change_password_modal.present();
  }

  // -------- Office In & Out Start -------
officeLoader = false;
officeIn(_text_office)
{
  console.log("Office In......");
  this.locationService.getPosition()
  .then(pos => {
       console.log(`location service long and lati Positon....: long: ${pos.lng} lat: ${pos.lat}`);
       this.lng = pos.lng;
       this.lat = pos.lat;
       this.zoom = 16; 
       if(_text_office == 'Office Out'){
        this.presentAlert(_text_office);
       }
       else{
        this.officeInData(_text_office);
       }
  })
  .catch((error) => {
    console.log("catch all clear..", error);
      this.locationAlert(); 
  }); 

}
officeInData(_text_office){
  this.getDirection();
  console.log("Text Office.....", _text_office);
  this.officeLoader = true;
  
  let curentDate = new Date();
  this.setStartdate = moment(curentDate).format('YYYY-MM-DD, HH:mm:ss');
  this.oficeIn_Url = 'office-in';
  this.oficeOut_Url = 'office-out';
    let fd = new FormData();
    
    if(_text_office == 'Office In'){
      this.officeLoader = true;
      fd.append('office_in', this.setStartdate);
      fd.append('lat_office_in', this.lat);
      fd.append('log_office_in', this.lng);

      this.formSubmitSubscribe = this.http.post(this.oficeIn_Url, fd).subscribe(
        (response:any) => {
          console.log("office In.... success");
          console.log("office in...",this.setStartdate);
          this.text_office = "Office Out";
          console.log("Office Called...",this.text_office);

          localStorage.setItem('employeeData', JSON.stringify({
            'office_in': this.setStartdate,
            'office_out': null
          }));
          this.office_in_data = JSON.parse(localStorage.getItem('employeeData'));
          this.commonUtils.presentToast('success', 'Office in at '+moment(curentDate).format('HH:mm:ss') );
          this.router.navigateByUrl('/dashboard/1');
          this.getProfile();
          this.officeLoader = false;
        },
        errRes => {
          console.log("office In.... not success");
          this.officeLoader = false;
        }
      );
    }else if(_text_office == 'Office Out'){
      this.officeLoader = true;
      console.log('this.officeLoader', this.officeLoader);
      
      fd.append('office_out', this.setStartdate);
      fd.append('lat_office_out', this.lat);
      fd.append('log_office_out', this.lng);
      this.formSubmitSubscribe = this.http.post(this.oficeOut_Url, fd).subscribe(
        (response:any) => {
          console.log("office Out.... success");
          console.log("office out...",this.setStartdate);
          this.text_office = "Office In";
          console.log("Office Called...",this.text_office);
          this.getProfile();
          localStorage.setItem('employeeData', JSON.stringify({
            'office_in': null,
            'office_out': null
          }));
          this.office_in_data = JSON.parse(localStorage.getItem('employeeData'));
          console.log('Localstorage employeeData', this.office_in_data);
          this.officeLoader = false;
          setTimeout(() => {
            
            this.commonUtils.presentToast('info', 'Office out at '+moment(curentDate).format('HH:mm:ss') );
            this.router.navigateByUrl('/welcome');
          }, 2000);
          
        },
        errRes => {
          console.log("office In.... not success");
          this.officeLoader = false;
        }
      );
    }
}
  // -------- Office In & Out End -------

// ------ office out aleart start ------
task_Url;
async presentAlert(_text_office) {
  const alert = await this.alertController.create({
    header: 'Have you updated your task?',
    cssClass: 'update-popup',
    buttons: [{
      text: 'Submit',
      role: 'confirm',
      cssClass: 'popup-ok-btn',
      handler: (data) => {
        console.log("hello....................",data);
        this.task_Url = `check-office-out`;
        let fd = new FormData();
        fd.append('task_update', data);
        this.taskDataSubscribe = this.http.post(this.task_Url, fd).subscribe(
          (res: any) => {
            if (res.return_status > 0) {
              this.officeInData(_text_office);
              this.commonUtils.presentToast('success', res.return_message);
            }
          },
          errRes => {
            this.commonUtils.presentToast('error', errRes.return_message);
          }
        );
        
      },
    },{
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'popup-cancel-btn',
      handler: () => {
        
      },
    }],
    inputs: [
      {
        label: 'Task updated',
        type: 'radio',
        value: 'updated',
        handler: () => {
        
        },
      },
      {
        label: 'Not have task',
        type: 'radio',
        value: 'noTask',
        handler: () => {
        
        },
      },
      {
        label: 'Work in client project',
        type: 'radio',
        value: 'client',
        handler: () => {
        
        },
      },
    ],
  });

  await alert.present();
}
// ------ office out aleart end ------
  
  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.logoutDataSubscribe !== undefined){
      this.logoutDataSubscribe.unsubscribe();
    }
    if(this.editDataSubscribe !== undefined){
      this.editDataSubscribe.unsubscribe();
    }
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
    if(this.taskDataSubscribe !== undefined){
      this.taskDataSubscribe.unsubscribe();
    }
    this.destroyed$.next();
    this.destroyed$.complete();
  }
// ---------- destroy subscription end ---------
 
  hours = 0;
  minutes = 0;
  seconds = 0;

  getElapsedTime(entry: Entry): TimeSpan {        
    let totalSeconds = Math.floor((new Date().getTime() - entry.created.getTime()) / 1000);
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    if (totalSeconds >= 3600) {
      this.hours = Math.floor(totalSeconds / 3600);      
      totalSeconds -= 3600 * this.hours;      
    }
    if (totalSeconds >= 60) {
      this.minutes = Math.floor(totalSeconds / 60);
      totalSeconds -= 60 * this.minutes;
    }
    this.seconds = totalSeconds;
    return {
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds
    };
  }
}
