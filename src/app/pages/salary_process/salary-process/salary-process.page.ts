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
  selector: 'app-salary-process',
  templateUrl: './salary-process.page.html',
  styleUrls: ['./salary-process.page.scss'],
})
export class SalaryProcessPage implements OnInit, OnDestroy {

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
 
   z_List: any;
   empList: any;
   fname: any;
   lname: any;
   emp_id: any;
   
 
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
 
       if( this.parms_action_name == 'Salary Proccess'){
        // form submit api add
        this.form_api = 'salary-log-add/'+this.parms_action_id;
       }
 
       // disable date call
 
       // file upload url
       this.uploadURL = `fileupload?identifier=internalsupportticket`;
 
       let curentDate = new Date();
       this.setStartdate = moment(curentDate).format('DD/MM/YYYY');
 
       setInterval(() => {
         this.curentDate = new Date();
       }, 1);
 
     }
 
     // init
     ngOnInit() {
 
     }
 
     ionViewWillEnter() {
       this.commonFunction();
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
             this.router.navigate([`salary/`+this.get_user_dtls.id]);
         }
   
         if( this.parms_action_name == 'Salary Proccess'){
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
 
 
 
 //----------- reload page start ------------
   reloadPage(){
     if( this.parms_action_name == 'Salary Proccess'){
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

  // get selected date
  myFunction(_item){
  console.log('get seleted date.....', _item);
  }
// datepicker 

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.formSubmitSubscribe !== undefined ){
      this.formSubmitSubscribe.unsubscribe();
    }
  }
// destroy subscription end

}
