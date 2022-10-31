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
  selector: 'app-pf-esi-add',
  templateUrl: './pf-esi-add.page.html',
  styleUrls: ['./pf-esi-add.page.scss'],
})
export class PfEsiAddPage implements OnInit, OnDestroy{

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  emp_id: any;
  fname: any;
  lname: any;

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
  private formSubmitSubscribe: Subscription;
  private editDataSubscribe: Subscription;
  private employeeDataSubscribe: Subscription;
  
  
  curentDate;
  // select checkbox end

//--------------  getlist data fetch start -------------
  setStartdate;
  selectLoading;
  form_submit_text = 'Submit';
  form_api;
  uploadURL;
  parms_action_name;
  parms_action_id;
  actionHeaderText;
  onEditField = 'PUT';
  editLoading;
  allEditData;
  form_show_api;
  from_data_show;
  get_user_dtls;
  get_api;

  getroll_url: any;
  z_List: any;
  roleList: any;
  des_url: any;
  desList:any;
  empList: any;
  

    commonFunction(){
      this.getEmployee();
      // get active url name
      this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);
      this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('type');
      this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
      // this.parms_action_id = this.activatedRoute.snapshot.params.id;
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
        this.form_show_api = 'pf-esi-view/'+this.parms_action_id;
      }else if(this.parms_action_name == 'edit'){
        this.form_show_api = 'pf-esi-view/'+this.parms_action_id;
        this.form_api = 'pf-esi-edit/'+this.parms_action_id;
      }else{
        // form submit api add
        this.form_api = 'pf-esi-add';
      }

      // disable date call

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

    }

    ionViewWillEnter() {
      this.commonFunction();
    }
  // init function call end
   
  // ---------- init start ----------
  init(){
    if( this.parms_action_name == 'view'){
      this.actionHeaderText = 'View';
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
              employee: res.return_data.employee.id,
              roll: res.return_data.roll.id,
              designation: res.return_data.designation.id,
              uan_no: res.return_data.uan_no,
              esi_no: res.return_data.esi_no,
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
          // this.selectLoadingDepend = false;
          this.editLoading = false;
        }
      );

    }else if( this.parms_action_name == 'edit'){
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
              employee: res.return_data.employee.id,
              roll: res.return_data.roll.id,
              designation: res.return_data.designation.id,
              uan_no: res.return_data.uan_no,
              esi_no: res.return_data.esi_no,
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

// ---------- get employee list data fetch start ----------
getEmployee(){
  this.editLoading = true;
  this.get_api = "get-employee";
  //edit data call
  this.employeeDataSubscribe = this.http.get(this.get_api).subscribe(
    (res:any) => {
      this.editLoading = false;
      console.log("Edit data  res >", res.return_data);
      if(res.return_status > 0){
        this.empList = res.return_data;
        for (let i = 0; i < this.empList.length; i++) {
          this.empList[i].employee = this.empList[i].employee_code;
        }
      }
    },
    errRes => {
      // this.selectLoadingDepend = false;
      this.editLoading = false;
    }
  );
}
// ---------- get employee list data fetch end ----------

onChange(_item){
  console.log("dropdown selected item >", _item);
  this.emp_id = _item;
  for (let i = 0; i < this.empList.length; i++) {
    this.empList[i].employee_fname = this.empList[i].first_name;
    this.empList[i].employee_lname = this.empList[i].last_name;
    if(this.empList[i].id == this.emp_id){
      this.fname = this.empList[i].employee_fname;
      this.lname = this.empList[i].employee_lname;
    }
  }
}

  // select company
  OnChangeSelect(_item){
    // this.contactByCompany(_item );
  }


// ======================== form submit start ===================
clickButtonTypeCheck = '';
form_submit_text_save = 'Save';

// click button type 
clickButtonType( _buttonType ){
  this.clickButtonTypeCheck = _buttonType;
}

onSubmit(form:NgForm){
  console.log("add form submit >", form.value);
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
        this.commonUtils.presentToast('success', response.return_message);
        if(this.clickButtonTypeCheck == 'Save' ){
            this.router.navigate([`pfandesi/`+this.get_user_dtls.id]);
        }
        if( this.parms_action_name == 'add'){
          // form.reset();
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

//----------- reload page start ------------
  reloadPage(){
    if( this.parms_action_name == 'add'){
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
    if(this.formSubmitSubscribe !== undefined ){
      this.formSubmitSubscribe.unsubscribe();
    }
    if(this.editDataSubscribe !== undefined ){
      this.editDataSubscribe.unsubscribe();
    }
    if(this.employeeDataSubscribe !== undefined ){
      this.employeeDataSubscribe.unsubscribe();
    }
  }
// destroy subscription end

}
