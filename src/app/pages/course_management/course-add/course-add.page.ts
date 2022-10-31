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
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.page.html',
  styleUrls: ['./course-add.page.scss'],
})
export class CourseAddPage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  courseList: any;
  amount: any;
  total: any;

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
  roleList;
  reportingUserList;
  get_user_dtls;

  // ------ init function call start ------

  // roleList = [
  //   { id: 1, name: 'Admin' },
  //   { id: 2, name: 'Marketing' },
  //   { id: 3, name: 'Operation' },
  //   { id: 4, name: 'Developer' },
  //   { id: 5, name: 'TL' },
  //   { id: 6, name: 'HR' },
  //   { id: 7, name: 'Developer_Manager' },
  //   { id: 8, name: 'Marketing_Manager' },
  // ];

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
      

      // getlist data
      this.getlist('get-course');

      if( this.parms_action_name == 'edit'){
        // form submit api edit
        this.form_show_api = 'get-course-id?id='+this.parms_action_id;
        this.form_api = 'edit-course?id='+this.parms_action_id;
      }else{
        // form submit api add
        this.form_api = 'add-course'
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
          console.log(this.from_data_show);
          
          if(res.return_status > 0){
            let total_amount;
            total_amount=this.from_data_show.amount-(this.from_data_show.amount * this.from_data_show.discount_amount)/100;
            // total_amount=parseInt(total_amount);
            this.model = {
              // industry_type : JSON.parse(res.return_data.industry_type),
              course_name : this.from_data_show.course_name,
              description : this.from_data_show.description,
              timeperiod : this.from_data_show.timeperiod,
              total_amount : this.from_data_show.total_amount
            }; 
            // console.log('model',this.model);
            
            // this.old_image = res.return_data[0].qualification_file;
            // status
            if(this.from_data_show.status == "Inactive"){
                this.model.enable = '';
            }else if(this.from_data_show.status == "Active"){
              this.model.enable = true;
            }
            console.log('model',this.model);
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

            // console.log('country >', this.model.country);
            /* this.model.borrower = [];
            res.return_data.company.forEach(element => {
              this.model.borrower.push(element.contact_id);
            }); */
            // this.selectedPeople = [this.people[0].id, this.people[1].id]
          }
        },
        errRes => {
          // this.selectLoadingDepend = false;
          this.editLoading = false;
        }
      );

    }else{
      this.actionHeaderText = 'Add';
      this.reloadPage();
    }
  }
  // ---------- init end ----------

  // ---------- getlist data fetch end ----------
    getlist(_getlistUrl){
      this.plt.ready().then(() => {
        this.selectLoading = true;
        this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
          resData => {
            this.selectLoading = false;
            console.log("Received getlist data>>>>>>>>...", resData);
            this.courseList = resData;
            // this.reportingUserList = resData.reporting_user;
          },
          errRes => {
            this.selectLoading = false;
          }
        );
      });
    }
  // getlist data fetch end

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
    this.courseList.forEach(element => {
     if(element.id==_item)
     {
       this.model.amount=element.total_amount;
     }
      
    });
    console.log("dropdown selected item >", _item);
  }
  onTotalamount(_amount)
  {
    if(this.model.amount)
    {
      
      this.model.tamount=(this.model.amount-(this.model.amount * _amount)/100)
    }
    console.log(this.model.tamount);
    
    
  }
  onDiscount(_amount)
  {
    this.model.disamount =((this.model.amount-_amount)/this.model.amount)  * 100;
    this.model.disamount=parseInt(this.model.disamount);
     console.log(parseInt(this.model.disamount));
     
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

      /* this.model.pages_address.forEach(element => {
        if(element.country_id == _item){
          colon_item.state_id = null;
          colon_item.city_id = null;
        }
      }); */
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
  }else{
    this.form_submit_text_save_another = 'Submitting';
  }
  

  this.form_submit_text = 'Submitting';

  // get form value
  let fd = new FormData();

  if(this.fileVal) {
  // normal file upload
  fd.append("document", this.fileVal, this.fileVal.name);
  }else{
    fd.append("document", '');
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
        // this.commonUtils.presentToast(response.return_message);
        this.commonUtils.presentToast('success', response.return_message);

        if(this.clickButtonTypeCheck == 'Save' ){

          if(this.get_user_dtls.emp_role == 'HR' || this.get_user_dtls.emp_role == 'Admin'){
            this.router.navigate(['/course']);
          }else {
            this.router.navigateByUrl(`profile-view/${this.model.id}`);
          }
        }

        // this.notifier.notify( type, 'aa' );
  
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

  // @ViewChild('fileInput') fileInputVariable: ElementRef;

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
    }else{
      this.model = {
        name : this.from_data_show.user_data.name,
        id : this.from_data_show.user_data.id,
        gender : this.from_data_show.user_data.gender,
        password : this.from_data_show.user_data.password,
        email : this.from_data_show.user_data.email,
        pemail : this.from_data_show.user_data.personal_email,
        phone : this.from_data_show.user_data.phone,
        emp_role : this.from_data_show.user_data.emp_role,
        reportingUser : this.from_data_show.user_data.reporting_user,
        address : this.from_data_show.user_data.address,
        designation : this.from_data_show.user_data.designation,
        join_date : this.from_data_show.user_data.join_date,
        resigned_date : this.from_data_show.user_data.resigned_date,
        resigned_reason : this.from_data_show.user_data.resigned_reason,
        image : this.from_data_show.user_data.image,
        enable : this.from_data_show.user_data.status,
        // superuser : parseInt(this.allEditData.return_data.superuser),
        // enable : parseInt(this.allEditData.return_data.status)
      };
      this.old_image = this.from_data_show.user_data.image;
      
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
  // this.commonUtils.addToItem(_items);
  // _items.push(_item);

  _items.push({"is_default":true});
  // console.log('_items >>>>>>>>.', _items);
  
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

}
