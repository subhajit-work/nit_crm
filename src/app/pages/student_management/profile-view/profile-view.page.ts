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
  selector: 'app-profile-view',
  templateUrl: './profile-view.page.html',
  styleUrls: ['./profile-view.page.scss'],
})

export class ProfileViewPage implements OnInit, OnDestroy {

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
  profilepath;
  step = 0;
  edit;
  update_Url;
  // ------ init function call start ------

    commonFunction(){
      this.edit = "Edit Information";
      // get active url name
      this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);
      
      this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
      this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
      

      // form submit api edit
      this.form_api = 'employee-details?id='+this.parms_action_id;
     

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

      
     
      
    }
    setStep(index: number){
      this.step = index;
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
          // -------edit data---------
          this.ProfileData = res.return_data.employee_data;
          this.profilepath = res.return_data.path;
          this.model = {
            first_name : this.ProfileData.first_name,
            last_name : this.ProfileData.last_name,
            personal_mail : this.ProfileData.personal_mail,
            phone_no : this.ProfileData.phone_no,
            address : this.ProfileData.address,
            employee_image : this.ProfileData.employee_image,
            path : this.profilepath,
          }
        }
      },
      errRes => {
        this.editLoading = false;
      }
    );
  }
  // ---------- init end ----------

  onSave(){
      this.edit = "Update Information";
      return;
  }
  onCancle(){
    this.edit = "Edit Information";
      return;
  }
  update(){
    this.fileChange();
  }
  fileChange(){

  }

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

  

fileValemployee_image;
fileValemployee_imageCross;
normalFileNameemployee_image;
uploademployee_imagePathShow = false;
imgaePreviewemployee_image;

normalFileUpload(event, _item, _name) {
  console.log('nomal file upload _item => ', _item);
  console.log('nomal file upload _name => ', _name);
  console.log('nomal file upload event => ', event);

  if(_name == 'employee_image'){
    this.fileValemployee_image =  event.target.files[0];

    const renderemployee_image = new FileReader();
    renderemployee_image.onload = () =>{
      this.imgaePreviewemployee_image = renderemployee_image.result;
    }
    renderemployee_image.readAsDataURL(this.fileValemployee_image);

    _item =  event.target.files[0].name;
    this.normalFileNameemployee_image = _name;
    this.uploademployee_imagePathShow = true;
  }
}


// ======================== form submit start ===================


  onSubmit(form:NgForm){
    console.log("add form submit >", form.value);
    this.update_Url = 'employee-profile-update/'+this.parms_action_id;
    let fd = new FormData();
    // fileValemployee_image

      if(this.fileValemployee_image) {
        
        fd.append(this.normalFileNameemployee_image, this.fileValemployee_image, this.fileValemployee_image.name);
      }else{
        fd.append('employee_image2', this.model.employee_image);
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

      this.formSubmitSubscribe = this.http.post(this.update_Url, fd).subscribe(
        (response:any) => {
          console.log("add form response >", response);
          if(response.return_status > 0){
            this.commonUtils.presentToast('success', response.return_message);
            this.edit = "Edit Information";
            this.init();
          }
        },
        errRes => {
          
        }
      );
  }
// form submit end



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