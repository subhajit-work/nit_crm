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
import { DomSanitizer } from '@angular/platform-browser';

/* tslint:disable */ 
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})

export class AddUserPage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  getstateId: any;

  constructor(
    private plt: Platform,
    private authService: AuthService,
    private modalController : ModalController,
    private storage: Storage,
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private http : HttpClient,
    private alertController : AlertController,
    private commonUtils: CommonUtils, // common functionlity come here
    private sanitizer: DomSanitizer,
  ) { }

  // variable declartion section
  model: any = {};
  private uploadSubscribe: Subscription;
  private formSubmitSubscribe: Subscription;
  private editDataSubscribe: Subscription;
  private getListSubscribe: Subscription;
  private getRollSubscribe: Subscription;
  private getCountrySubscribe: Subscription;
  private getStateSubscribe: Subscription;
  private getCitySubscribe: Subscription;
  private getdesSubscribe: Subscription;
  private getModulesSubscribe: Subscription;
  private getAcc_urlSubscribe: Subscription;
  private deleteModulesSubscribe: Subscription;
  
  
  
  
  
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
  default_country_id;
  cityMainList;
  industryTypeList;
  getCountryId;
  form_show_api;
  old_image;
  from_data_show;
  getlistData;
  roleList;
  reportingUserList;
  get_user_dtls;
  getroll_url;
  country_list:any = [];
  getcountry_url;
  getstate_url;
  state_list;
  getcity_url;
  city_list;
  z_List;
  des_url;
  desList;
  moduleList;
  getmodules_url
  // newDynamic;
  dynamicArray: any = [];
  dataArray: any = [];
  deletebtn = true;
  rows:any = [];
  row: any;
  module: any;
  p_dashboard_cards: boolean;
  p_chart: boolean;
  p_list: boolean;
  p_add: boolean;
  p_update: boolean;
  p_view: boolean; 
  p_delete:boolean;
  newDynamic: any = {};
  addrow: boolean = false;
  step = 0;
  myArray: any;
  isAdmin: any;
  error: string;
  getAcc_url: any;
  // acc_manager_list: any;
  account_manager: boolean = false;
  is_Admin_true: boolean;
    commonFunction(){
      // getRoll data
      this.getCountry();
      this.getRoll();
      this.getdesignation();
      this.getModules();
      // get active url name
      this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);
      this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('type');
      this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
      console.log('this.parms_action_name aaa11 >>>>>>>>>>', this.parms_action_name);
      console.log('this.parms_action_id aaa11 >>>>>>>>>>', this.parms_action_id);

      // ----------Get login details start
      this.authService.globalparamsData.subscribe(res => {
        if(res != null || res != undefined){
          this.get_user_dtls = res.user;
          console.log('this.get_user_dtls aaa11 >>>>>>>>>>', this.get_user_dtls);
        }
      });
      // Get login details end
      

      
      if( this.parms_action_name == 'view'){
        // form submit api edit
        this.form_show_api = 'employee-view/'+this.parms_action_id;
      }else if(this.parms_action_name == 'edit'){
        this.form_show_api = 'employee-view/'+this.parms_action_id;
        this.form_api = 'update-employee/'+this.parms_action_id;
      }else{
        // form submit api add
        this.form_api = 'register'
      }

      // disable date call
      this.dateDisable();
      

      // file upload url
      this.uploadURL = `fileupload?identifier=internalsupportticket`;

      let curentDate = new Date();
      this.setStartdate = moment(curentDate).format('DD/MM/YYYY');

      setInterval(() => {
        this.curentDate = new Date();
      }, 1);

      // init call
      this.init();

    }

    // init
    ngOnInit() {
      this.newDynamic = {module:"", p_dashboard_cards: 0,p_chart: 0, p_list: 0, p_add: 0, p_update: 0, p_view: 0, p_delete: 0 };
      this.dynamicArray.push(this.newDynamic);
    }

    ionViewWillEnter() {
      this.commonFunction();
    }
  // init function call end

// add & Delete Row Function Start
addRow(index) {  
  this.newDynamic = { module:"", p_dashboard_cards: 0, p_chart: 0, p_list: 0, p_add: 0, p_update: 0, p_view: 0, p_delete: 0};
  this.dynamicArray.push(this.newDynamic);
  console.log(this.dynamicArray);
  return true;
}

deleteRow(index, modulId) {
  console.log("Module Data......",modulId);
  
  if(this.dynamicArray.length ==1) {
      this.commonUtils.presentToast('error', "Can't delete the row when there is only one row");
      return false;
} else {
      this.dynamicArray.splice(index, 1);
      this.deleteModule(modulId);
      return true;
  }
}
// add & Delete Row Function End

// delete module start
deletemodules_url
deleteModule(modulId){
  this.deletemodules_url = 'delete-permission/'+modulId+'/'+this.parms_action_id;
  this.selectLoading = true;
  this.deleteModulesSubscribe = this.http.post(this.deletemodules_url, '').subscribe(
    resData => {
      this.selectLoading = false;
    },
    errRes => {
      this.selectLoading = false;
    }
  );
}

// delete module end

onModuleChange(_item , index){
  console.log("Module Change.......",_item);
  this.dynamicArray[index].p_list = 1;
  for (let i = 0; i < this.moduleList.length; i++) {
    if(this.moduleList[i].id == _item){
      this.moduleList.splice(i,1);
    }
  }
  
}

onChartChange(_event){
  console.log("Chart Change.......",_event);
}
  //-------------Designation Data--------------
  getdesignation(){
    this.des_url = 'get-designation';
    this.selectLoading = true;
    this.getdesSubscribe = this.http.get(this.des_url).subscribe(
      resData => {
        this.selectLoading = false;
        console.log("Received getdes data>>>>>>>>...", resData);
        this.z_List = resData;
        this.desList = this.z_List.return_data;
      },
      errRes => {
        this.selectLoading = false;
      }
    );
  }
  //-------------Designation Data--------------

  //-------------Get Roll Data--------------
  getRoll(){
    this.getroll_url = 'get-roll';
    this.selectLoading = true;
    this.getRollSubscribe = this.http.get(this.getroll_url).subscribe(
      resData => {
        this.selectLoading = false;
        console.log("Received getRoll data>>>>>>>>...", resData);
        this.z_List = resData;
        this.roleList = this.z_List.return_data;
      },
      errRes => {
        this.selectLoading = false;
      }
    );
  }
  // ---------------get roll data---------------

    //-------------Get Modules Data--------------
    getModules(){
      this.getmodules_url = 'get-modules';
      this.selectLoading = true;
      this.getModulesSubscribe = this.http.get(this.getmodules_url).subscribe(
        resData => {
          this.selectLoading = false;
          console.log("Received getModules data>>>>>>>>...", resData);
          this.z_List = resData;
          this.moduleList = this.z_List.return_data;
          console.log("Received getModules List>>>>>>>>...", this.moduleList);
        },
        errRes => {
          this.selectLoading = false;
        }
      );
    }
    // ---------------get Modules data---------------

    onChangeRoll(_item){
        console.log("Roll Item......", _item);
      
    }

   

  // -------------- On Cahange Country -----------
  OnChangeCountry(_item){
    console.log("countrylist list Item.....",_item);
    this.getstateId = _item;
    this.getState(_item);
   }
  // -------------- On Cahange Country -----------
  // -------------- On Cahange State -----------
  OnChangeState(_item){
    console.log("Statelist list Item.....",_item);
    this.getCity(_item)
  }
  // -------------- On Cahange State -----------

  // ------------- Get Country ----------
  getCountry(){
    this.getcountry_url = 'get-countries';
    this.plt.ready().then(() => {
      this.selectLoading = true;
      this.getCountrySubscribe = this.http.get(this.getcountry_url).subscribe(
        (resData) => {
          this.selectLoading = false;
          this.z_List = resData;
          this.country_list = this.z_List.return_data;
          console.log("Received get Country data>>>>>>>>...", this.z_List);
        },
        errRes => {
          this.selectLoading = false;
        }
      );
    });
  }
  // ------------- Get Country ----------
  //-------------- Get State ------------
  getState(_item){
    this.getstate_url = 'get-states/'+_item;
    this.plt.ready().then(() => {
      this.selectLoading = true;
      this.getStateSubscribe = this.http.get(this.getstate_url).subscribe(
        resData => {
          this.selectLoading = false;
          console.log("Received get State data>>>>>>>>...", resData);
          this.z_List = resData;
          this.state_list = this.z_List.return_data;
        },
        errRes => {
          this.selectLoading = false;
        }
      );
    });
  }
  //-------------- Get State ------------
  //-------------- Get City ------------
  getCity(_item){
    this.getcity_url = 'get-cities/'+_item;
    this.plt.ready().then(() => {
      this.selectLoading = true;
      this.getCitySubscribe = this.http.get(this.getcity_url).subscribe(
        resData => {
          this.selectLoading = false;
          console.log("Received get City data>>>>>>>>...", resData);
          this.z_List = resData;
          this.city_list = this.z_List.return_data;

        },
        errRes => {
          this.selectLoading = false;
        }
      );
    });
  }
  //-------------- Get City ------------
  
  setStep(index: number){
    this.step = index
  }

  // -------Account Validate Start-------
  accountvalid(account_no, reaccount_no)
  {
    console.log(account_no, reaccount_no);
    if (reaccount_no == undefined) {
      this.error = '';
        
    }else if (account_no!=reaccount_no) {
        this.error = "Account Number not match.";
        setTimeout(()=>{                           // <<<---using ()=> syntax
      }, 3000);
    }else
    {
      this.error = "";
    }
    
  }
  // -------Account Validate End-------
   
  // ---------- init start ----------
  init(){
    if( this.parms_action_name == 'view'){
      this.actionHeaderText = 'View';
      // this.onEditField = 'PUT';

      this.editLoading = true;
      //edit data call
      this.editDataSubscribe = this.http.get(this.form_show_api).subscribe(
        (res:any) => {
          this.editLoading = false;
          console.log("Edit data  res >", res.return_data);
          // console.log("State data  res..... >", res.return_data.state.name);
          this.from_data_show = res.return_data;
          if(res.return_data.is_admin == 'Yes'){
            this.is_Admin_true = true;
          }else if(res.return_data.is_admin == 'No'){
            this.is_Admin_true = false;
          }

          if(res.return_status > 0){
            this.model = {
              employee_code: res.return_data.employee_code,
              email: res.return_data.email,
              mail_password: res.return_data.mail_password,
              roll: res.return_data.roll.id,
              account_manager: res.return_data.account_manager,
              designation: res.return_data.designation.id,
              do_joining: res.return_data.do_joining,
              skype_id: res.return_data.skype_id,
              skype_password : res.return_data.skype_password,
              is_admin : this.is_Admin_true,
              

              first_name : res.return_data.first_name,
              last_name : res.return_data.last_name,
              dob : res.return_data.dob,
              gender : res.return_data.gender,

              country : res.return_data.country.id,
              state : res.return_data.state.id,
              city : res.return_data.city.id,
              personal_mail : res.return_data.personal_mail,
              phone_no : res.return_data.phone_no,
              address : res.return_data.address,
              pin_code : res.return_data.pin_code,

              bank_name : res.return_data.bank_name,
              branch : res.return_data.branch,
              ifsc_code : res.return_data.ifsc_code,
              account_no : res.return_data.account_no,
              acholder_name: res.return_data.acholder_name,

              employee_image : res.return_data.employee_image,
              aadhar_no : res.return_data.aadhar_no,
              aadhar_image : res.return_data.aadhar_image,
              pan_no : res.return_data.pan_no,
              pan_image : res.return_data.pan_image,
              resume : res.return_data.resume,

              qualification : res.return_data.qualification,
              experience : res.return_data.experience,
              path : res.return_data.path,
            }; 
            this.getState(res.return_data.country.id);
            this.getCity(res.return_data.state.id);
            this.onChangeRoll(res.return_data.roll.id);
            if(res.return_data.is_admin)
            console.log("Permision data  res >", res.return_data.permission.length);
            for (let i = 0; i < res.return_data.permission.length; i++) {
              this.dynamicArray.splice(i);
            }
            for (let i = 0; i < res.return_data.permission.length; i++) {
              this.newDynamic = { module:"", p_dashboard_cards: 0, p_chart: 0, p_list: 0, p_add: 0, p_update: 0, p_view: 0, p_delete: 0};
              this.dynamicArray.push(this.newDynamic);
              this.dynamicArray[i].module = res.return_data.permission[i].module.id;
              console.log("Dynamic Module DataTransfer....",this.dynamicArray[i].module);
              this.dynamicArray[i].p_dashboard_cards = res.return_data.permission[i].p_dashboard_cards;
              this.dynamicArray[i].p_chart = res.return_data.permission[i].p_chart;
              this.dynamicArray[i].p_list = res.return_data.permission[i].p_list;
              this.dynamicArray[i].p_add = res.return_data.permission[i].p_add;
              this.dynamicArray[i].p_update = res.return_data.permission[i].p_update;
              this.dynamicArray[i].p_view = res.return_data.permission[i].p_view;
              this.dynamicArray[i].p_delete = res.return_data.permission[i].p_delete;
            }
          }
        },
        errRes => {
          this.editLoading = false;
        }
      );

    }else if( this.parms_action_name == 'edit'){
      this.actionHeaderText = 'Edit';

      this.editLoading = true;
      //edit data call
      this.editDataSubscribe = this.http.get(this.form_show_api).subscribe(
        (res:any) => {
          this.editLoading = false;
          console.log("Edit data  res >", res.return_data);
          this.from_data_show = res.return_data;
          if(res.return_status > 0){
            this.model = {
              employee_code: res.return_data.employee_code,
              email: res.return_data.email,
              mail_password: res.return_data.mail_password,

              roll: res.return_data.roll.id,
              account_manager: res.return_data.account_manager,
              designation: res.return_data.designation.id,
              do_joining: res.return_data.do_joining,
              skype_id: res.return_data.skype_id,
              skype_password : res.return_data.skype_password,
              is_admin : this.is_Admin_true,

              first_name : res.return_data.first_name,
              last_name : res.return_data.last_name,
              dob : res.return_data.dob,
              gender : res.return_data.gender,

              country : res.return_data.country.id,
              state : res.return_data.state.id,
              city : res.return_data.city.id,
              personal_mail : res.return_data.personal_mail,
              phone_no : res.return_data.phone_no,
              address : res.return_data.address,
              pin_code : res.return_data.pin_code,

              bank_name : res.return_data.bank_name,
              branch : res.return_data.branch,
              ifsc_code : res.return_data.ifsc_code,
              account_no : res.return_data.account_no,
              acholder_name: res.return_data.acholder_name,

              employee_image : res.return_data.employee_image,
              aadhar_no : res.return_data.aadhar_no,
              aadhar_image : res.return_data.aadhar_image,
              pan_no : res.return_data.pan_no,
              pan_image : res.return_data.pan_image,
              resume : res.return_data.resume,

              qualification : res.return_data.qualification,
              experience : res.return_data.experience,
              path : res.return_data.path,

            }; 
            this.getState(res.return_data.country.id);
            this.getCity(res.return_data.state.id);
            this.onChangeRoll(res.return_data.roll.id);

            console.log("Permision data  res >", res.return_data.permission.length);
            for (let i = 0; i < res.return_data.permission.length; i++) {
              this.dynamicArray.splice(i);
            }
            for (let i = 0; i < res.return_data.permission.length; i++) {
              this.newDynamic = { module:"", p_dashboard_cards: 0, p_chart: 0, p_list: 0, p_add: 0, p_update: 0, p_view: 0, p_delete: 0};
              this.dynamicArray.push(this.newDynamic);
              this.dynamicArray[i].module = res.return_data.permission[i].module.id;
              console.log("Dynamic Module DataTransfer....",this.dynamicArray[i].module);
              this.dynamicArray[i].p_dashboard_cards = res.return_data.permission[i].p_dashboard_cards;
              this.dynamicArray[i].p_chart = res.return_data.permission[i].p_chart;
              this.dynamicArray[i].p_list = res.return_data.permission[i].p_list;
              this.dynamicArray[i].p_add = res.return_data.permission[i].p_add;
              this.dynamicArray[i].p_update = res.return_data.permission[i].p_update;
              this.dynamicArray[i].p_view = res.return_data.permission[i].p_view;
              this.dynamicArray[i].p_delete = res.return_data.permission[i].p_delete;
            }
          }
        },
        errRes => {
          this.editLoading = false;
        }
      );

    }else{
      this.actionHeaderText = 'Add';
      this.reloadPage();
    }
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
  }
  onChangecheck(check){
    console.log("Checked value ......", check);
    
  }

  // select company
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

  is_Admin(_event){
    console.log("Is Admin ........", _event.currentTarget.checked);
    this.isAdmin =  _event.currentTarget.checked;
    for (let i = 0; i < this.moduleList.length; i++) {
      this.dynamicArray.splice(i);
    }
    if(this.isAdmin == true){
      for (let i = 0; i < this.moduleList.length; i++) {
        this.newDynamic = { module:"", p_dashboard_cards: 0, p_chart: 0, p_list: 0, p_add: 0, p_update: 0, p_view: 0, p_delete: 0};
        this.dynamicArray.push(this.newDynamic);
      }
      this.admin_permission_module();
    }
    else{
      for (let i = 0; i < this.moduleList.length; i++) {
        this.dynamicArray.splice(i);
      }
      this.newDynamic = { module:"", p_dashboard_cards: 0, p_chart: 0, p_list: 0, p_add: 0, p_update: 0, p_view: 0, p_delete: 0};
      this.dynamicArray.push(this.newDynamic);
    }
  }

  admin_permission_module(){
    for (let i = 0; i < this.moduleList.length; i++) {
      this.dynamicArray[i].module = this.moduleList[i].id;
      console.log("Dynamic Module DataTransfer....",this.dynamicArray[i].module);
      this.dynamicArray[i].p_dashboard_cards = 1;
      this.dynamicArray[i].p_chart = 1;
      this.dynamicArray[i].p_list = 1;
      this.dynamicArray[i].p_add = 1;
      this.dynamicArray[i].p_update = 1;
      this.dynamicArray[i].p_view = 1;
      this.dynamicArray[i].p_delete = 1;
    }
  }
// -----datepicker start------
  datePickerObj:any = {};
  dateDisable(){
    let curentDate = new Date();

    this.datePickerObj = {
      dateFormat: 'YYYY-MM-DD', // default DD MMM YYYY
      closeOnSelect: true,
      yearInAscending: true,
    };
  }


  // get selected date
  myFunction(){
    console.log('get seleted date')
  }
// datepicker 

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
  console.log("Module data.......",this.dynamicArray);


  if(!form.value.is_admin){
    console.log('In');
    form.value.is_admin = 'No';
  }else if (form.value.is_admin == false) {
    form.value.is_admin = 'No';
  }
  else if (form.value.is_admin == true) {
    form.value.is_admin = 'Yes';
  }

  

  console.log('form.value.status', form.value.status);


  if(this.clickButtonTypeCheck == 'Save'){
    this.form_submit_text_save = 'Submitting';
  }
  
  

  this.form_submit_text = 'Submitting';

  // get form value
  let fd = new FormData();

  // fileValaadhar_image
  if(this.fileValaadhar_image) {
    fd.append(this.normalFileNameaadhar_image, this.fileValaadhar_image, this.fileValaadhar_image.name);
  }else if(this.fileValaadhar_imageCross == 'cross_aadhar_image'){
    fd.append('aadhar_image', 'removed');
  }else{
    fd.append('aadhar_image', '');
  }

  

  // fileValresume
  if(this.fileValresume) {
    fd.append(this.normalFileNameresume, this.fileValresume, this.fileValresume.name);
  }else if(this.fileValresumeCross == 'cross_resume'){
    fd.append('resume', 'removed');
  }else{
    fd.append('resume', '');
  }

  // fileValpan_image
  if(this.fileValpan_image) {
    fd.append(this.normalFileNamepan_image, this.fileValpan_image, this.fileValpan_image.name);
  }else if(this.fileValpan_imageCross == 'cross_pan_image'){
    fd.append('pan_image', 'removed');
  }else{
    fd.append('pan_image', '');
  }

  
  // fileValemployee_image
  if(this.fileValemployee_image) {
    fd.append(this.normalFileNameemployee_image, this.fileValemployee_image, this.fileValemployee_image.name);
  }else if(this.fileValemployee_imageCross == 'cross_employee_image'){
    fd.append('employee_image', 'removed');
  }else{
    fd.append('employee_image', '');
  }

  if(Object.keys(this.dynamicArray).length)
  {
    fd.append('module',JSON.stringify(this.dynamicArray));
  }
  else
  {
    fd.append('module','0');
  }
  if (this.dynamicArray.length < 1) {
    this.dynamicArray = [];
  }
  console.log('pp',JSON.stringify(this.dynamicArray));

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
      }
      this.form_submit_text = '';
      console.log("add form response >", response);

      if(response.return_status > 0){
        this.files = [];
        this.pdcFiles = [];
        this.commonUtils.presentToast('success', response.return_message);

        if(this.clickButtonTypeCheck == 'Save' ){

            this.router.navigate([`/employee/`+'2']);
          
        }

  
        if( this.parms_action_name == 'add'){
          this.files = [];
          this.model.profile = '';
          this.model = {};
          this.reloadPage();
        }

        
        
      }
    },
    errRes => {
      if(this.clickButtonTypeCheck == 'Save'){
        this.form_submit_text_save = 'Save';
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
                          
// Normal file upload end

//----------- reload page start ------------
  reloadPage(){
    if( this.parms_action_name == 'add'){
      this.files = [];
      this.model = {
        enable : 'Active'
      };
    }else{
      this.model = {
       
      };
      
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
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          cssClass: 'popup-ok-btn',
          handler: () => {
            console.log('Confirm Okay');
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

// Normal file upload
resumename;
//--------addhar file upload-------
fileValaadhar_image;
fileValaadhar_imageCross;
normalFileNameaadhar_image;
imgaePreviewaadhar_image;
uploadaadhar_imagePathShow = false;

//--------Appointment Letter file upload-------
fileValappointment_letter;
fileValappointment_letterCross;
normalFileNameappointment_letter;
imgaePreviewappointment_letter;
uploadappointment_letterPathShow = false;

//--------employee file upload-------
fileValemployee_image;
fileValemployee_imageCross;
normalFileNameemployee_image;
imgaePreviewemployee_image;
uploademployee_imagePathShow = false;

//--------pan file upload-------
fileValpan_image;
fileValpan_imageCross;
normalFileNamepan_image;
imgaePreviewpan_image;
uploadpan_imagePathShow = false;

//--------resume file upload-------
fileValresume;
fileValresumeCross;
normalFileNameresume;
imgaePreviewresume;
uploadresumePathShow = false;

//--------Normal File Upload Methoad---------
  async normalFileUpload(event, _item, _name) {
  console.log('nomal file upload _item => ', _item);
  console.log('nomal file upload _name => ', _name);
  console.log('nomal file upload event => ', event);

  if(_name == 'aadhar_image'){
    this.fileValaadhar_image =  event.target.files[0];

    const renderaadhar_image = new FileReader();
    renderaadhar_image.onload = () =>{
      this.imgaePreviewaadhar_image = renderaadhar_image.result;
      console.log('this.imgaePreview >>', this.imgaePreviewaadhar_image);
    }
    renderaadhar_image.readAsDataURL(this.fileValaadhar_image);

    _item =  event.target.files[0].name;
    this.normalFileNameaadhar_image = _name;
    this.uploadaadhar_imagePathShow = true;
  }else if(_name == 'employee_image'){
    this.fileValemployee_image =  event.target.files[0];

    const renderemployee_image = new FileReader();
    renderemployee_image.onload = () =>{
      this.imgaePreviewemployee_image = renderemployee_image.result;
      console.log('this.imgaePreview >>', this.fileValemployee_image);
    }
    renderemployee_image.readAsDataURL(this.fileValemployee_image);

    _item =  event.target.files[0].name;
    this.normalFileNameemployee_image = _name;
    this.uploademployee_imagePathShow = true;
  }else if(_name == 'appointment_letter'){
    this.fileValappointment_letter =  event.target.files[0];

    const renderappointment_letter = new FileReader();
    renderappointment_letter.onload = () =>{
      this.imgaePreviewappointment_letter = renderappointment_letter.result;
      console.log('this.imgaePreview >>', this.fileValappointment_letter);
    }
    renderappointment_letter.readAsDataURL(this.fileValappointment_letter);

    _item =  event.target.files[0].name;
    this.normalFileNameappointment_letter = _name;
    this.uploadappointment_letterPathShow = true;
  }else if(_name == 'pan_image'){
    this.fileValpan_image =  event.target.files[0];

    const renderpan_image = new FileReader();
    renderpan_image.onload = () =>{
      this.imgaePreviewpan_image = renderpan_image.result;
      console.log('this.imgaePreview >>', this.imgaePreviewpan_image);
    }
    renderpan_image.readAsDataURL(this.fileValpan_image);

    _item =  event.target.files[0].name;
    this.normalFileNamepan_image = _name;
    this.uploadpan_imagePathShow = true;
  }else if(_name == 'resume'){
    this.fileValresume =  event.target.files[0];
    if (this.fileValresume.type == 'application/pdf') {
      const renderresume = new FileReader();
      renderresume.onload = () =>{
        this.imgaePreviewresume = renderresume.result;
        console.log('this.imgaePreview >>', this.imgaePreviewresume);
      }
      renderresume.readAsDataURL(this.fileValresume);

      _item =  event.target.files[0].name;
      this.resumename = _item;
      console.log("resume image file name..",_item);
      
      this.normalFileNameresume = _name;
      this.uploadresumePathShow = true;
    } else {
      const reload = await this.alertController.create({
        header: 'Allert Message!',
        message: 'file type should be an image of pdf',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'popup-cancel-btn color-red',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }
        ]
      });

      await reload.present();
      this.model.resume2 = '';
      return false;
    }
    
  }
} 

fileCross(_item, _identifire){
  if(_identifire == 'aadhar_image'){
    this.model.aadhar_image = null;
    this.model.aadhar_image2 = null;
    this.normalFileNameaadhar_image = '';
    this.fileValaadhar_imageCross = 'cross_aadhar_image';
    this.uploadaadhar_imagePathShow = false;
  }else if(_identifire == 'employee_image'){
    this.model.employee_image = null;
    this.model.employee_image2 = null;
    this.normalFileNameemployee_image = '';
    this.fileValemployee_imageCross = 'cross_employee_image';
    this.uploademployee_imagePathShow = false;
  }else if(_identifire == 'appointment_letter'){
    this.model.appointment_letter = null;
    this.model.appointment_letter2 = null;
    this.normalFileNameappointment_letter = '';
    this.fileValappointment_letterCross = 'cross_appointment_letter';
    this.uploadappointment_letterPathShow = false;
  }else if(_identifire == 'pan_image'){
    this.model.pan_image = null;
    this.model.pan_image2 = null;
    this.normalFileNamepan_image = '';
    this.fileValpan_imageCross = 'cross_pan_image';
    this.uploadpan_imagePathShow = false;
  }else if(_identifire == 'resume'){
    this.model.resume = null;
    this.model.resume2 = null;
    this.normalFileNameresume = '';
    this.fileValresumeCross = 'cross_resume';
    this.uploadresumePathShow = false;
  }
}

// remove item contact
removeItem(index, event, items, action, isDefault){
  this.commonUtils.removeToItem(index, event, items, action, isDefault);
}

transform() {
  return this.sanitizer.bypassSecurityTrustResourceUrl(this.imgaePreviewresume);
}

// ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
    if(this.uploadSubscribe !== undefined){
      this.uploadSubscribe.unsubscribe();
    }
    if(this.editDataSubscribe !== undefined ){
      this.editDataSubscribe.unsubscribe();
    }
    if(this.getRollSubscribe !== undefined ){
      this.getRollSubscribe.unsubscribe();
    }
    if(this.getCountrySubscribe !== undefined ){
      this.getCountrySubscribe.unsubscribe();
    }
    if(this.getStateSubscribe !== undefined ){
      this.getStateSubscribe.unsubscribe();
    }
    if(this.getCitySubscribe !== undefined ){
      this.getCitySubscribe.unsubscribe();
    }
    if(this.getdesSubscribe !== undefined ){
      this.getdesSubscribe.unsubscribe();
    }
    if(this.getModulesSubscribe !== undefined ){
      this.getModulesSubscribe.unsubscribe();
    }
    if(this.getAcc_urlSubscribe !== undefined ){
      this.getAcc_urlSubscribe.unsubscribe();
    }
    if(this.deleteModulesSubscribe !== undefined ){
      this.deleteModulesSubscribe.unsubscribe();
    }
  }
// destroy subscription end
}




