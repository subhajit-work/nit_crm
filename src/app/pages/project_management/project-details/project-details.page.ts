import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Platform, ModalController, AlertController } from '@ionic/angular';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { CommonUtils } from '../../../services/common-utils/common-utils';
import { environment } from '../../../../environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
})

export class ProjectDetailsPage implements OnInit, OnDestroy {

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
  private uploadSubscribe: Subscription;
  private getListSubscribe: Subscription;
  private formSubmitSubscribe: Subscription;
  private editDataSubscribe: Subscription;
  curentDate;
  // select checkbox end

//--------------  getlist data fetch start -------------
  transaction_id;
  account
  accountList;
  lender
  lenderList;
  borrower;
  borrowerList;
  principle;
  interest;
  setStartdate;
  setEnddate;
  contact_by_company;
  servicesList;
  selectLoading;
  selectLoadingDepend;
  groupList;
  form_submit_text = 'Submit';
  form_api;
  uploadURL;
  interestCycle = '1';
  parms_action_name;
  parms_action_id;
  actionHeaderText;
  toggleShow;
  companyList;
  countryList;
  stateList;
  onEditField = 'PUT';
  editLoading;
  allEditData;
  industryList;
  cityList;
  companyCategoryList;
  countryCodeList;
  default_country_id;
  cityMainList;
  industryTypeList;
  getCountryId;
  get_user_dtls;
  get_user_id;
  view_api;
  viewFormData;
  leadTypeName = false;
  panelOpenState = false;

  // ------ init function call start ------

  leadTypeList = [
    { id: 1, name: 'Website' },
    { id: 2, name: 'Android' },
    { id: 3, name: 'iOS' },
    { id: 4, name: 'Digital marketing' },
    { id: 5, name: 'Other' },
  ];

  leadStatusList = [
    { id: 1, name: 'Process' },
    { id: 2, name: 'Complete' },
    { id: 3, name: 'Inactive' },
    { id: 4, name: 'Convert' },
  ];

    commonFunction(){
      // get active url name
      this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);
      this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
      this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
      
      this.form_api = 'add-task-progress';

      this.view_api = 'get-task-progress?task_id='+this.parms_action_id;
      
      this.authService.globalparamsData.subscribe(res => {
        if(res != null || res != undefined){
          this.get_user_dtls = res.user;
          this.get_user_id = res.user.emp_id;
          console.log('this.get_user_dtls aaa11 >>>>>>>>>>', this.get_user_dtls);
        }
      });

      // init call
      this.init();

      // file upload url
      this.uploadURL = `fileupload?identifier=internalsupportticket`;

      let curentDate = new Date();
      this.setStartdate = moment(curentDate).format('DD/MM/YYYY');

      setInterval(() => {
        this.curentDate = new Date();
      }, 1);

      

      // disable date call
      this.dateDisable();

    }

    // init
    ngOnInit() {
    //  this.commonFunction();
      
    }

    ionViewWillEnter() {
      this.commonFunction();
    }
  // init function call end
   
  // ---------- init start ----------
  init(){
    this.editLoading = true;
    //edit data call
    this.editDataSubscribe = this.http.get(this.view_api).subscribe(
      (res:any) => {
        this.editLoading = false;
        
        this.viewFormData = res.return_data;
        console.log("Edit data  res >", this.viewFormData);
        if(res.return_status > 0){
          // edit data
          this.allEditData = res;
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


  //-------------------- pdc file upload start-------------------------
    pdcFiles: any = [];
    pdcUploadResponseProgress = false;
    
    // file upload
    pdcUploadFile(_type, e) {
      this.pdcUploadResponseProgress = true;
      if(_type == 'single'){
        this.pdcFiles = [];
        let singleFile = e[0];
        this.goForUpload(this.uploadURL, singleFile, this.pdcFiles);
      }else{
        for (let index = 0; index < e.length; index++) {
          const element = e[index];
          this.goForUpload(this.uploadURL, element, this.pdcFiles);
        }  
      }
    }
  // pdc file upload end


  onChange(_item){
    console.log("dropdown selected item >", _item);
    if(_item.length == 0){
      this.leadTypeName = false;
    }
    for (let i = 0; i < _item.length; i++) {
      console.log('lead type', _item[i]);
      if(_item[i] == "Other"){
        this.leadTypeName = true;
      }else {
        this.leadTypeName = false;
      }
    }
  }

  // select company
  OnChangeSelect(_item){
    // this.contactByCompany(_item );
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

// date picker start
onChangeDateTime(_val){
  console.log('get seleted time >', _val);
  this.model.time_preffer = _val;
}

datePickerObj:any = {};
dateDisable(){

  let curentDate = new Date();
  this.setStartdate = moment(curentDate).format('DD-MM-YYYY');

  this.datePickerObj = {
    disableWeekDays: [0],
    dateFormat: 'DD-MM-YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true,
    fromDate: new Date(curentDate),
  };


}
timePickerObj: any = {
  timeFormat: '', // default 'hh:mm A'
  setLabel: 'Set', // default 'Set'
  closeLabel: 'Close', // default 'Close'
  titleLabel: 'Select a Time', // default 'Time'
  clearButton: true, // default true
  btnCloseSetInReverse: false, // default false
  momentLocale: 'pt-BR', //  default 'en-US'
};
// date picker end

// getlist data fetch start
getlist(_getlistUrl){
  console.log('getlist>>>>');
  this.plt.ready().then(() => {
    this.selectLoading = true;
    this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
      resData => {
        this.selectLoading = false;
        console.log('getlist',resData);
        this.countryCodeList = resData.data;

        this.model.country_code = '91';
        console.log('this.model.country_code', this.model.country_code);
      },
      errRes => {
        this.selectLoading = false;
      }
    );
  });
}
// getlist data fetch end

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

  if(this.fileVal) {
  // normal file upload
  fd.append("image", this.fileVal, this.fileVal.name);
  }else{
    fd.append("image", '');
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
        this.files = [];
        this.pdcFiles = [];
        this.commonUtils.presentToast('success', response.return_message);
        // init call
        this.init();
        this.model = {};
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
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          cssClass: 'popup-ok-btn',
          handler: () => {
            _itemsArray.splice(_index, 1);
          }
        }
      ]
    });

    await alert.present();
  }
// delete  Aleart End

// Normal file upload
fileVal;
normalFileUpload(event) {
  this.fileVal =  event.target.files[0];
  this.model.image =  event.target.files[0].name;
}
fileCross(_item1){
  this.model.image = '';
  this.model.profile2 = '';
}
// Normal file upload end

//----------- reload page start ------------
  reloadPage(){
    if( this.parms_action_name == 'add'){
      this.files = [];
      this.model = {
        enable : 'Active'
      };
      this.model.country_code = '91';
    }else{
      this.model = {
        fname : this.allEditData.return_data.fname,
        lname : this.allEditData.return_data.lname,
        email : this.allEditData.return_data.email,
        mobile : this.allEditData.return_data.mobile,
        username : this.allEditData.return_data.username,
        password : this.allEditData.return_data.password,
        role_id : this.allEditData.return_data.role_id,
        image : this.allEditData.return_data.image,
        country_id : this.allEditData.return_data.country_id,
        state_id : this.allEditData.return_data.state_id,
        city_id : this.allEditData.return_data.city_id,
        pin : this.allEditData.return_data.pin,
        address_1 : this.allEditData.return_data.address_1,
        address_2 : this.allEditData.return_data.address_2,
      };
      this.model.country_code = '91';
      // status
      if(this.allEditData.return_data.status){
        if(this.allEditData.return_data.status == '1'){
            this.model.enable = 'Active';
        }else{
            this.model.enable = '';
        }
      }

      // superuser
      if(this.allEditData.return_data.superuser){
        if(this.allEditData.return_data.superuser == '1'){
          this.model.superuser = 'Active';
        }else{
          this.model.superuser = '';
        }
      }
      
    }
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

// addItem contact
addItem(_items, _item){
  _items.push({"is_default":true});
}

// remove item contact
removeItem(index, event, items, action, isDefault){
  this.commonUtils.removeToItem(index, event, items, action, isDefault);
}

// ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
    if(this.getListSubscribe !== undefined){
      this.getListSubscribe.unsubscribe();
    }
    if(this.uploadSubscribe !== undefined){
      this.uploadSubscribe.unsubscribe();
    }
    if(this.editDataSubscribe !== undefined ){
      this.editDataSubscribe.unsubscribe();
    }
  }
// destroy subscription end
}