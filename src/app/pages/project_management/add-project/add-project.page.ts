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
  selector: 'app-add-project',
  templateUrl: './add-project.page.html',
  styleUrls: ['./add-project.page.scss'],
})

export class AddProjectPage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  projectList: any;
  getAcc_url: string;
  z_List: any;
  acc_manager_list: any;
  project_type: any;

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
  private getProjectSubscribe: Subscription;
  private getAcc_urlSubscribe: Subscription;
  private getClientSubscribe: Subscription;
  
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
  // onEditField = 'PUT';
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
  // statusList: any;
  project_id: any;
  clientList: any;

  // ------ init function call start ------

  statusList = [
    { id: 1, name: 'Ongoing' },
    { id: 2, name: 'Completed' },
    { id: 3, name: 'Ontesting' },
  ];

    commonFunction(){
      // get active url name
      this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);
      this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('type');
      this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');

      // ----------Get login details start
      this.authService.globalparamsData.subscribe(res => {
        if(res != null || res != undefined){
          this.get_user_dtls = res.user;
          console.log('this.get_user_dtls aaa11 >>>>>>>>>>', this.get_user_dtls);
        }
      });
      // Get login details end
      this.getproject();
      this.getAcc_Manager();
      this.getclient();

      this.get_api = "get-employee";

      if( this.parms_action_name == 'view'){
        // form submit api edit
        this.form_show_api = 'project-view/'+this.parms_action_id;
      }else if(this.parms_action_name == 'edit'){
        this.form_show_api = 'project-view/'+this.parms_action_id;
        this.form_api = 'project-edit/'+this.parms_action_id;
      }else{
        // form submit api add
        this.form_api = 'project-add'
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
    if( this.parms_action_name == 'view'){
      this.actionHeaderText = 'View';

      this.editLoading = true;
      //edit data call
      this.editDataSubscribe = this.http.get(this.form_show_api).subscribe(
        (res:any) => {
          this.editLoading = false;
          console.log("View data  res >", res.return_data);
          this.from_data_show = res.return_data;
          
          if(res.return_status > 0){
            for (let i = 0; i < res.return_data.p_type.length; i++) {
              this.project_type = res.return_data.p_type;
              console.log("Project Type....",this.project_type);
            }
            this.model = {
              project_name : res.return_data.project_name,
              project_description : res.return_data.project_description,
              front_end : res.return_data.front_end,
              back_end : res.return_data.back_end,
              client : res.return_data.client.id,
              project_status : res.return_data.project_status,
              project_type: res.return_data.p_type,
              start_date: res.return_data.start_date,
              end_date: res.return_data.end_date,
              project_cost: res.return_data.project_cost,
              project_manager: res.return_data.project_managers.id,
              agreement_document : res.return_data.agreement_document,
              path: res.return_data.path,
            }; 
            this.allEditData = res;
          }
        },
        errRes => {
          // this.selectLoadingDepend = false;
          this.editLoading = false;
        }
      );

    }else if(this.parms_action_name == 'edit'){
      this.actionHeaderText = 'Edit';

      this.editLoading = true;
      //edit data call
      this.editDataSubscribe = this.http.get(this.form_show_api).subscribe(
        (res:any) => {
          this.editLoading = false;
          console.log("View data  res >", res.return_data);
          this.from_data_show = res.return_data;
          
          if(res.return_status > 0){
            for (let i = 0; i < res.return_data.p_type.length; i++) {
              this.project_type = res.return_data.p_type;
              console.log("Project Type....",this.project_type);
            }
            this.model = {
              project_name : res.return_data.project_name,
              project_description : res.return_data.project_description,
              front_end : res.return_data.front_end,
              back_end : res.return_data.back_end,
              client : res.return_data.client.id,
              project_status : res.return_data.project_status,
              project_type: res.return_data.p_type,
              start_date: res.return_data.start_date,
              end_date: res.return_data.end_date,
              project_cost: res.return_data.project_cost,
              project_manager: res.return_data.project_managers.id,
              agreement_document : res.return_data.agreement_document,
              path: res.return_data.path,
            }; 
            this.allEditData = res;
          }
        },
        errRes => {
          // this.selectLoadingDepend = false;
          this.editLoading = false;
        }
      );
    }
    else{
      this.actionHeaderText = 'Add';
      // this.reloadPage();
    }
  }
  // ---------- init end ----------

  getAcc_Manager(){
    this.getAcc_url = 'get-account-manager';
    this.plt.ready().then(() => {
      this.selectLoading = true;
      this.getAcc_urlSubscribe = this.http.get(this.getAcc_url).subscribe(
        resData => {
          this.selectLoading = false;
          console.log("Received get Account Manager data>>>>>>>>...", resData);
          this.z_List = resData;
          this.acc_manager_list = this.z_List.return_data;
          for (let i = 0; i < this.acc_manager_list.length; i++) {
          console.log("Received get Account Manager before data>>>>>>>>...", this.acc_manager_list);
            this.acc_manager_list[i].acc_manager = this.acc_manager_list[i].first_name +' '+ this.acc_manager_list[i].last_name;
            console.log("Received get Account Manager after data>>>>>>>>...", this.acc_manager_list[i].acc_manager);
          }
        },
        errRes => {
          this.selectLoading = false;
        }
      );
    });
    }

  // ---------- Get Project ----------
    getproject(){
      this.plt.ready().then(() => {
        this.selectLoading = true;
        this.getProjectSubscribe = this.commonUtils.getlistCommon('get-project-type').subscribe(
          resData => {
            console.log("Project Data.....", resData);
            this.selectLoading = false;
            this.projectList = resData;
            console.log("project List Data.....", this.projectList);
          },
          errRes => {
            this.selectLoading = false;
          }
        );
      });
    }
  // getlist data fetch end

  // ---------- Client Name ----------
  getclient(){
    this.plt.ready().then(() => {
      this.selectLoading = true;
      this.getClientSubscribe = this.commonUtils.getlistCommon('get-client').subscribe(
        resData => {
          console.log("Client Data.....", resData);
          this.selectLoading = false;
          this.clientList = resData;
          console.log("Client List Data.....", this.clientList);
        },
        errRes => {
          this.selectLoading = false;
        }
      );
    });
  }
// Client data fetch end

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
        // this.selectLoadingDepend = false;
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
      // disableWeekDays: [0],
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

  if(this.clickButtonTypeCheck == 'Save'){
    this.form_submit_text_save = 'Submitting';
  }else{
    this.form_submit_text_save_another = 'Submitting';
  }
  

  this.form_submit_text = 'Submitting';

  // get form value
  let fd = new FormData();

  // fileValagreement_document
  if(this.fileValagreement_document) {
    fd.append(this.normalFileNameagreement_document, this.fileValagreement_document, this.fileValagreement_document.name);
  }else if(this.fileValagreement_documentCross == 'cross_agreement_document'){
    fd.append('agreement_document', 'removed');
  }else{
    fd.append('agreement_document', '');
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
        this.project_id = response.return_data
        if(this.clickButtonTypeCheck == 'Save' ){

            this.router.navigateByUrl(`project-management/`+ '6');
        }

        if( this.parms_action_name == 'add'){
          // form.reset();
          this.files = [];
          this.model.profile = '';
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

          }
        }
      ]
    });

    await alert.present();
  }
// delete  Aleart End

// Normal file upload
fileVal;

// Normal file upload end

// addItem contact
addItem(_items, _item){

  _items.push({"is_default":true});
  
}

// remove item contact
removeItem(index, event, items, action, isDefault){
  this.commonUtils.removeToItem(index, event, items, action, isDefault);
}

//--------Agreement file upload-------
fileValagreement_document;
fileValagreement_documentCross;
normalFileNameagreement_document;
imgaePreviewagreement_document;
uploadagreement_documentPathShow = false;

//--------Normal File Upload Methoad---------
normalFileUpload(event, _item, _name) {
  console.log('nomal file upload _item => ', _item);
  console.log('nomal file upload _name => ', _name);
  console.log('nomal file upload event => ', event);

  if(_name == 'agreement_document'){
    this.fileValagreement_document =  event.target.files[0];

    const renderagreement_document = new FileReader();
    renderagreement_document.onload = () =>{
      this.imgaePreviewagreement_document = renderagreement_document.result;
      console.log('this.imgaePreview >>', this.fileValagreement_document);
    }
    renderagreement_document.readAsDataURL(this.fileValagreement_document);

    _item =  event.target.files[0].name;
    this.normalFileNameagreement_document = _name;
    this.uploadagreement_documentPathShow = true;
  }
} 

fileCross(_item, _identifire){
  if(_identifire == 'agreement_document'){
    this.model.agreement_document = null;
    this.model.agreement_document2 = null;
    this.normalFileNameagreement_document = '';
    this.fileValagreement_documentCross = 'cross_agreement_document';
    this.uploadagreement_documentPathShow = false;
  }
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
    if(this.getProjectSubscribe !== undefined ){
      this.getProjectSubscribe.unsubscribe();
    }
    if(this.getAcc_urlSubscribe !== undefined ){
      this.getAcc_urlSubscribe.unsubscribe();
    }
    if(this.getClientSubscribe !== undefined ){
      this.getClientSubscribe.unsubscribe();
    }
  }
// destroy subscription end
}