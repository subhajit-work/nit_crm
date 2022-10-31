import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, ModalController, AlertController, IonContent } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';

import { CommonUtils } from '../../../services/common-utils/common-utils';
import { AuthService } from '../../../services/auth/auth.service';

import { environment } from '../../../../environments/environment';

/* tslint:disable */ 

@Component({
  selector: 'app-attandance',
  templateUrl: './attandance.page.html',
  styleUrls: ['./attandance.page.scss'],
})

export class AttandancePage implements OnInit, OnDestroy {

  @ViewChild(IonContent) content: IonContent;

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  
  constructor(
    private plt: Platform,
    private modalController : ModalController,
    private authService: AuthService,
    private storage: Storage,
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private http : HttpClient,
    private alertController : AlertController,
    private commonUtils: CommonUtils // common functionlity come here
  ) { }

  // variable declartion section
  model: any = {};
  private getListSubscribe: Subscription;
  private uploadSubscribe: Subscription;
  private stateByCitySubscribe: Subscription;
  private formSubmitSubscribe: Subscription;
  private editDataSubscribe: Subscription;
  private viewPageDataSubscribe : Subscription;
  private logoutDataSubscribe : Subscription;
  curentDate;
  // select checkbox end

//--------------  getlist data fetch start -------------
  setStartdate;
  setEnddate;
  servicesList;
  selectLoading;
  selectLoadingDepend;
  form_submit_text = 'Submit';
  form_api;
  companyByContact_api;
  uploadURL;
  gender = '1';
  parms_action_name;
  parms_action_id;
  actionHeaderText;
  toggleShow;
  companyList;
  countryList;
  stateList;
  cityList;
  onEditField = 'PUT';
  onHiddenRole;
  editLoading;
  allEditData;
  stateByCity_api;
  getCountryId;
  firstDate;
  secondDate;
  getlistData;
  user_status = true;
  genderArry;
  ProfileData;
  loginTransaction;
  attandanceData: any;
  offici_in: any;

  // ------ init function call start ------

    commonFunction(){

      // get active url name
      this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);
      
      this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
      this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
      
      // getlist data

      // form submit api edit
      this.form_api = 'attendance-employee-list';
     

      //stateByCity_api
      this.stateByCity_api = 'ajaxs_post/'

      // view data call (autologin check)
      this.viewPageDataSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
        console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
        if(res){
        }
      })

      

      // file upload url
      this.uploadURL = `fileupload?identifier=registration`;

      let curentDate = new Date();
      this.setStartdate = moment(curentDate).format('DD/MM/YYYY');

      setInterval(() => {
        this.curentDate = new Date();
      }, 1);

      // init call
      this.init();

      // multiple qualification
      this.model.qualification = [
        {
          "is_default":true
        }
      ];
      
      // multiple Certification
      this.model.certification = [
        {
          "is_default":true
        }
      ];

      // multiple Experience
      this.model.experience = [
        {
          "is_default":true
        }
      ];
      
    }

  // init
  ngOnInit() {
  }

  // scroll event detect
  isFixedHeader;
  onScrollHedearFix(event) {
    if (event.detail.scrollTop > 56) {
      this.isFixedHeader = true;
    } else {
      this.isFixedHeader = false;
    };
  }

  ionViewWillEnter() {
    this.commonFunction();
  }
  
  ionViewDidEnter(){
    // go to scroll top in mozila browser
    this.content.scrollToTop(0);
  }
  
  // ---------- init start ----------
  init(){
    this.editLoading = true;
    //edit data call
    this.editDataSubscribe = this.http.get(this.form_api).subscribe(
      (res:any) => {
        this.editLoading = false;
        console.log("Edit data  res >", res.return_data);
        if(res.return_status > 0){
          // edit data
          this.attandanceData = res.return_data;
          console.log('attandanceData',this.attandanceData);
          for (let i = 0; i < this.attandanceData.length; i++) {
            this.offici_in = this.attandanceData[i].attendance_data;
          console.log("Office In......",this.offici_in);

          }
        }
      },
      errRes => {
        // this.selectLoadingDepend = false;
        this.editLoading = false;
      }
    );
  }
  // ---------- init end ----------

  // ----------------- file upload start -------------
    files: any = [];
    uploadResponseProgress;
    
    // file upload
    uploadFile(_type, e) {
      console.log('e >>>>>>>>>>>>>>>>>>>', e);
      if(_type == 'single'){
        this.files = [];
        let singleFile = e[0];
        this.goForUpload(this.uploadURL, singleFile, this.files);
      }else{
        for (let index = 0; index < e.length; index++) {
          const element = e[index];
          this.goForUpload(this.uploadURL, element, this.files);
        }  
      }
    }
    // goForUpload call
    goForUpload(_url, _getvalue, _filesArray){
      const fd = new FormData();
      fd.append('files', _getvalue, _getvalue.name);

      this.uploadSubscribe = this.http.post<any>(_url, fd, {
        reportProgress: true,
        observe: 'events'
        }).subscribe( event => {
          if(event.type === HttpEventType.UploadProgress){
            this.uploadResponseProgress = Math.round( event.loaded / event.total * 100 );
          }else if(event.type === HttpEventType.Response){
            event.body.return_data_mobile.files.id = '';
            _filesArray.push(event.body.return_data_mobile.files);
            this.uploadResponseProgress = 0;
          }
      })
    }
  // file upload end


  onChange(_item){
  }

  // select state
  OnChangeSelect(_item){
  }

  onChangeLocation(_item, _identifire, colon_item){
    let identy;
    if(_identifire == 'state'){
      identy = 'return_getState';

      colon_item.state_id = null;
      colon_item.city_id = null;

      
    }else{
      identy = 'return_getCity';
      colon_item.city_id = null;
    }
  }

  //stateByCity
  stateByCity = function( _id , _name, _colon_item){
    this.selectLoadingDepend = true;
    this.stateByCitySubscribe = this.http.get(this.stateByCity_api+ _name + '/' + _id).subscribe(
      (res:any) => {
        this.selectLoadingDepend = false;
        if(res.return_status > 0){

          if(_name == 'return_getState'){
            this.stateList = res.return_data.state;
          }else{
            this.cityList = res.return_data.city;
          }
        }
    },
    errRes => {
      this.selectLoadingDepend = false;
    }
    );
  }

  getlist(_getlistUrl){
    this.plt.ready().then(() => {
      this.selectLoading = true;
      this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
        resData => {
          this.selectLoading = false;

          //------ city/state data fetch start -------
          this.countryList = resData.country;
          this.getlistData = resData;

          // this.getlistData
         

          if(resData.country.list){
            resData.country.list.forEach(value => {
              if(value.id == resData.country.default){
                this.model.country_id = value.id;
                this.getCountryId = value.id;
              }
            });
          }

          
        
          //-city/state data fetch end -

        },
        errRes => {
          this.selectLoading = false;
        }
      );
    });
  }
// getlist data fetch end

// Location check start
checkLocation(_longitude, _latitude) {
  console.log('_longitude', _longitude);
  console.log('_latitude', _latitude);
  let url = 'https://www.latlong.net/c/?lat='+_latitude+'&long='+_longitude;
  window.open(url, '_blank');
}
// Location check end

// ========= datepicker start =======
  datePickerObj: any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  };

  // get selected date
  myFunction(){
    console.log('get seleted date');
  }

  startdatePickerObj: any = {
    dateFormat: 'DD/MM/YYYY',
    closeOnSelect: true,
    yearInAscending: true
  };

  endDatePickerObj:any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  };

  certificationEndDatePickerObj:any ={
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  }

  experienceEndDatePickerObj:any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  }

  // --- start date select ---
  selectCycleDate;
  getStartDate;
  onDateChangeDate(_identifire, _item,  _itemDate){

    console.log('onDateChangeDate _identifire>', _identifire);
    console.log('onDateChangeDate _item >', _item);
    console.log('onDateChangeDate _itemDate >', _itemDate);

    if(_itemDate){
      // ----- original date format convert start -----
        let myFormatDate = _itemDate.split(" ")[0].split("/");
        let _mynewdate = myFormatDate[2] + "-" + myFormatDate[1] + "-" + myFormatDate[0];
      // original date format convert end

      console.log('_itemDate  start date select >>>', _itemDate);
      this.model.end_date = '';

      
      if(_identifire == 'certification_start_date'){
        _item.end_date = '';
        _item.duration = '';
        this.certificationEndDatePickerObj = {
          dateFormat: 'DD/MM/YYYY',
          fromDate: new Date(_mynewdate),
          closeOnSelect: true,
          yearInAscending: true
        };
      }else if(_identifire == 'experience_start_date'){
        _item.end_date = '';
        _item.duration = '';
        this.experienceEndDatePickerObj = {
          dateFormat: 'DD/MM/YYYY',
          fromDate: new Date(_mynewdate),
          closeOnSelect: true,
          yearInAscending: true
        };
      }

      // ----- no of day calculate start --------
     
      
      if(_identifire == 'certification_end_date' || _identifire == 'experience_end_date'){
        // ----- original date format convert start -----
        let myFormatDateStart
        if(_item.start_date){
          myFormatDateStart = _item.start_date.split(" ")[0].split("/");
        }
        // original date format convert end
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        this.firstDate = new Date(myFormatDateStart[2], myFormatDateStart[1], myFormatDateStart[0]);
        this.secondDate = new Date(myFormatDate[2], myFormatDate[1], myFormatDate[0]);

        _item.duration = Math.round(Math.abs((this.firstDate - this.secondDate) / oneDay));
        console.log('diffDays >>>>>>>>>>>>>>>>>>>>>>>>>>>>////////////>>>>>>', _item.duration);
      }
      // no fo day calculate end

    }else{
      _item.end_date = '';
      _item.duration = '';
    }
    
  }


// datepicker  end

//======= datepicker  end ==============

// radiobutton change
radioButtonChange(_val){
  console.log('radio button change value >', _val);
}


// ======================== form submit start ===================
  clickButtonTypeCheck = '';
  form_submit_text_save = 'Save';
  form_submit_text_save_another = 'Save & Add Another' ;

  // click button type 
  clickButtonType( _buttonType ){
    this.clickButtonTypeCheck = _buttonType;
  }

  onSubmit(form:NgForm){
    console.log("add form submit >", form.value);
    
    if(this.clickButtonTypeCheck == 'Save'){
      this.form_submit_text_save = 'Submitting';
    }else{
      this.form_submit_text_save_another = 'Submitting';
    }

    this.form_submit_text = 'Submitting';

    // get form value
    let fd = new FormData();

    if(this.fileValResume) {
      // normal file upload
      fd.append(this.normalFileNameResume, this.fileValResume, this.fileValResume.name);
    }else if(this.fileValResumeCross == 'cross_resume'){
      fd.append('resume', 'removed');
    }else{
      fd.append('resume', '');
    }
  

    // fileValprofile
    if(this.fileValprofile) {
      // normal file upload
      fd.append(this.normalFileNameProfile, this.fileValprofile, this.fileValprofile.name);
    }else if(this.fileValprofileCross == 'cross_image'){
      fd.append('image', 'removed');
    }else{
      fd.append('image', '');
    }

    for (let val in form.value) {
      if(form.value[val] == undefined){
        form.value[val] = '';
      }
      fd.append(val, form.value[val]);
    };

    console.log('value >', fd);

    if(!form.valid){
      return;
    }

    this.formSubmitSubscribe = this.http.post(this.form_api, fd).subscribe(
      (response:any) => {

        if(this.clickButtonTypeCheck == 'Save'){
          this.form_submit_text_save = 'Save';
        }else{
          this.form_submit_text_save_another = 'Save & Add Another';
        }



        this.form_submit_text = '';
        console.log("add form response >", response);

        if(response.return_status > 0){

          // user details set
          if(response.return_data.user){
          }
          
          this.files = [];
          // this.commonUtils.presentToast(response.return_message);
          this.commonUtils.presentToast('success', response.return_message);

          if(this.clickButtonTypeCheck == 'Save'){


          }

    
          if( this.parms_action_name == 'add'){
            this.model = {};
          }
          
        }
      },
      errRes => {
        if(this.clickButtonTypeCheck == 'Save'){
          this.form_submit_text_save = 'Save';
        }else{
          this.form_submit_text_save_another = 'Save & Add Another';
        }
        this.form_submit_text = '';
      }
    );

  }
// form submit end

// delete uploaded file Aleart Start

  @ViewChild('fileInput') fileInputVariable: ElementRef;

  async deleteAlertConfirm(_itemsArray, _index) {
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Do you really want to delete selected item ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'popup-cancel-btn',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          cssClass: 'popup-ok-btn',
          handler: () => {
            _itemsArray.splice(_index, 1);
            this.fileInputVariable.nativeElement.value = "";

          }
        }
      ]
    });

    await alert.present();
  }
// delete  Aleart End

// Normal file upload
  fileValResume;
  fileValprofile;
  fileValprofileCross;
  fileValResumeCross;
  normalFileNameResume;
  normalFileNameProfile;
  uploadImagePathShow = false;
  uploadresumePathShow = false;
  normalFileUpload(event, _item, _name) {
    console.log('nomal file upload _item => ', _item);
    console.log('nomal file upload _name => ', _name);

    if(_name == 'resume'){
      this.fileValResume =  event.target.files[0];
      _item =  event.target.files[0].name;
      this.normalFileNameResume = _name;
      this.uploadresumePathShow = true;
    }else{
      this.fileValprofile =  event.target.files[0];
      _item =  event.target.files[0].name;
      this.normalFileNameProfile = _name;
      this.uploadImagePathShow = true;
    }
  }
  fileCross(_item, _identifire){
    if(_identifire == 'resume'){
      this.model.resume = null;
      this.normalFileNameResume = '';
      this.fileValResumeCross = 'cross_resume';

    }else{
      this.model.image = null;
      this.normalFileNameProfile = '';
      this.fileValprofileCross = 'cross_image';
    }
  }
// Normal file upload end

//----------- reload page start ------------
  reloadPage(){
    
  }
  // reload alert
  async reloadPageAlert() {
    const reload = await this.alertController.create({
      header: 'Reload',
      message: 'Do you really want to Reload?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'popup-cancel-btn',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          cssClass: 'popup-ok-btn',
          handler: () => {
            this.reloadPage();

          }
        }
      ]
    });

    await reload.present();
  }
// reload page end
// addItem
  addItem(_items){
    console.log('_items >', _items);
    this.commonUtils.addToItem(_items);
  }

  // remove item
  removeItem(index, event, items, action, isDefault){
    this.commonUtils.removeToItem(index, event, items, action, isDefault);
  }

   // ------ export function call start ------
   export_url;
   onExport(_identifier, _item){
      this.getListSubscribe = this.authService.globalparamsData.subscribe(res => {
        this.export_url = this.file_url+'/'+_item;
      });
      window.open(this.export_url);
   }
   // export function call end

// ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.getListSubscribe !== undefined){
      this.getListSubscribe.unsubscribe();
    }
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
    if(this.stateByCitySubscribe !== undefined){
      this.stateByCitySubscribe.unsubscribe();
    }
    if(this.uploadSubscribe !== undefined){
      this.uploadSubscribe.unsubscribe();
    }
    if(this.editDataSubscribe !== undefined ){
      this.editDataSubscribe.unsubscribe();
    }
    if(this.viewPageDataSubscribe !== undefined ){
      this.viewPageDataSubscribe.unsubscribe();
    }
    if(this.logoutDataSubscribe !== undefined ){
      this.logoutDataSubscribe.unsubscribe();
    }
  }
// destroy subscription end
}