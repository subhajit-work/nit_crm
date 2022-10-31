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
  selector: 'app-add-work',
  templateUrl: './add-work.page.html',
  styleUrls: ['./add-work.page.scss'],
})

export class AddWorkPage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  constructor(
    private plt: Platform,
    private authService: AuthService,
    private modalController : ModalController,
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
  private formSubmitSubscribe: Subscription;
  private editDataSubscribe: Subscription;
  private getListSubscribe: Subscription;
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
  currencyList;
  languageList;
  project_typeList;
  get_user_dtls;
  get_api;
  managerList;
  teamList;
  statusList;

  // ------ init function call start ------

    commonFunction(){
      // get active url name
      this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);
      this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
      this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');

      // ----------Get login details start
      this.authService.globalparamsData.subscribe(res => {
        if(res != null || res != undefined){
          this.get_user_dtls = res.user;
          console.log('this.get_user_dtls aaa11 >>>>>>>>>>', this.get_user_dtls);
        }
      });
      // Get login details end
      

      this.get_api = "get-employee";

      if( this.parms_action_name == 'edit'){
        // form submit api edit
        this.form_show_api = 'get-work?id='+this.parms_action_id;
        this.form_api = 'work-update?id='+this.parms_action_id;
      }else{
        // form submit api add
        this.form_api = 'task-log-add/'+this.parms_action_id;
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
    //  this.commonFunction();
    }

    ionViewWillEnter() {
      this.commonFunction();
    }
  // init function call end
   
  // ---------- init start ----------
  init(){
    if( this.parms_action_name == 'edit'){
      this.actionHeaderText = 'Edit';
      this.onEditField = 'PUT';

      this.editLoading = true;
      //edit data call
      this.editDataSubscribe = this.http.get(this.form_show_api).subscribe(
        (res:any) => {
          this.editLoading = false;
          console.log("Edit data  res >", res.return_data);
          this.from_data_show = res.return_data;
          if(res.return_status > 0){
            this.model = {
              work_name : res.return_data.work_data.work_name,
              project_type : res.return_data.work_data.project_type,
              start_date : res.return_data.work_data.start_date,
              end_date : res.return_data.work_data.end_date,
              description : res.return_data.work_data.description,
              language : res.return_data.work_data.language,
              currency_type : res.return_data.work_data.currency_type,
              document : res.return_data.work_data.document,
              manager_id : res.return_data.work_data.manager_id,
              emp_ids : res.return_data.work_data.emp_ids,
              client_name : res.return_data.work_data.client_name,
              mobile : res.return_data.work_data.mobile,
              alt_mobile : res.return_data.work_data.alt_mobile,
              email : res.return_data.work_data.email,
              alt_email : res.return_data.work_data.alt_email,
              company_name : res.return_data.work_data.company_name,
              company_address : res.return_data.work_data.company_address,
              company_gst : res.return_data.work_data.company_gst,
              company_pan : res.return_data.work_data.company_pan,
              status : res.return_data.work_data.status,
            }; 
            

            // superuser
            if(res.return_data.superuser){
              if(res.return_data.superuser == '1'){
                this.model.superuser = 'Active';
              }else{
                this.model.superuser = '';
              }
            }

            // edit data
            this.allEditData = res;

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

  // ---------- getlist data fetch start ----------
  getTeamMembers(_id){
    this.editLoading = true;
    //edit data call
    this.editDataSubscribe = this.http.get(this.get_api+'?emp_id='+_id).subscribe(
      (res:any) => {
        this.editLoading = false;
        console.log("Edit data  res >", res.return_data);
        if(res.return_status > 0){
          this.teamList = res.return_data;
        }
      },
      errRes => {
        this.editLoading = false;
      }
    );
  }
  // ---------- getlist data fetch end ----------

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
            // console.log('event.body >>>>>', event.body);
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
      // console.log('e >>>>>>>>>>>>>>>>>>>', e);
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



// -----datepicker start------
  datePickerObj:any = {};
  dateDisable(){
    let curentDate = new Date();

    this.datePickerObj = {
      disableWeekDays: [0],
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

  if(form.value.status == ''){
    console.log('In');
    form.value.status = 'Inactive';
  }else if (form.value.status == true) {
    form.value.status = 'Active';
  }
  console.log('form.value.status', form.value.status);
  if(this.clickButtonTypeCheck == 'Save'){
    this.form_submit_text_save = 'Submitting';
  }
  this.form_submit_text = 'Submitting';

  // get form value
  let fd = new FormData();

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
        // this.commonUtils.presentToast(response.return_message);
        this.commonUtils.presentToast('success', response.return_message);

        if(this.clickButtonTypeCheck == 'Save' ){

            this.router.navigate([`/task/`+this.get_user_dtls.id]);
        }
  
        if( this.parms_action_name == 'add'){
          // form.reset();
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
            // console.log('Confirm Okay');
            _itemsArray.splice(_index, 1);
            // this.fileInputVariable.nativeElement.value = "";

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
  this.model.document =  event.target.files[0].name;
}
fileCross(_item1){
  this.model.document = '';
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

// remove item contact
removeItem(index, event, items, action, isDefault){
  this.commonUtils.removeToItem(index, event, items, action, isDefault);
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
  }
// destroy subscription end
}