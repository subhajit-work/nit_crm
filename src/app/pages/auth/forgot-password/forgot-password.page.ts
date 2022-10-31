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

const API_MASTER = environment.apiMaster;

/* tslint:disable */ 
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})

export class ForgotPasswordPage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  constructor(
    private router: Router,
    private http : HttpClient,
    private commonUtils: CommonUtils // common functionlity come here
  ) { }

  error: string;
  isLoading = false;
  forgetpass = false;
  openOtp = false;
  otpsubmitloader = false;
  getotpData: any;
  passwordLoading = false;
  createpass = false;
  email: any;
  hide = true;
  cm_hide = true;
    ngOnInit() {
      
    }

    ionViewWillEnter() {
      this.commonFunction();
    }

    commonFunction(){
      this.forgetpass = true; 
    }

    // --------Get Otp Start--------
  getotp(form:NgForm){
    this.isLoading=true;
    this.email = form.value.email;
    this.http.post("forget-password", form.value).subscribe(
      (res:any) => {
        if(res.return_status > 0)
        {
          this.getotpData = res.return_data;
          this.commonUtils.presentToast('success', res.return_message);
          this.forgetpass = false; 
          this.openOtp = true;
        }
        else
        {
          this.commonUtils.presentToast('error', res.return_message);
          this.isLoading=false;
        } 
      },
      (err) => {
          console.log(err);
          this.commonUtils.presentToast('error', err.message);
          this.isLoading=false;
      }
    );
  }
    // ------Get Otp End------

  // -------send Opt Start-------
  submitotp(form:NgForm){

    console.log(form.value);
    this.otpsubmitloader = true;
    let fd = new FormData();
    fd.append('otp', form.value.otp);
    fd.append('otpcheck', this.getotpData);
    this.http.post("otp-validation", fd).subscribe(
      (res:any) => {
        console.log(res);
        if(res.return_status > 0)
        {
          this.commonUtils.presentToast('success', res.return_message);
          this.openOtp = false;
          this.createpass = true;
        }
        else
        {
          this.commonUtils.presentToast('error', res.return_message);
          this.otpsubmitloader = false;
        } 
      },
      (err) => {
          console.log(err);
          this.otpsubmitloader = false;
      }
    );
  }
  // -------send Opt End-------

  // -------Account Validate Start-------
  accountvalid(new_password,conform_password)
  {
    console.log(new_password,conform_password);
    if (conform_password == undefined) {
      this.error = '';
    }else if (new_password!=conform_password) {
        this.error = "Confirm Password  not match.";
        setTimeout(()=>{                           // <<<---using ()=> syntax
      }, 3000);
    }else
    {
      this.error = "";
    }
  }
  // -------Account Validate End-------

  submitPassword(form:NgForm){
    console.log(form.value);
    this.passwordLoading = true;
    let fd = new FormData();
    fd.append('email', this.email);
    fd.append('new_password', form.value.new_password);
    fd.append('confirm_password', form.value.confirm_password);
    this.http.post("create-password", fd).subscribe(
      (res:any) => {
        console.log(res.return_message);
        if(res.return_status > 0)
        {
          this.commonUtils.presentToast('success', res.return_message);
            this.router.navigateByUrl("auth");
        }
        else
        {
          this.commonUtils.presentToast('error', res.return_message);
          this.passwordLoading = false;
        }
      },
      (err) => {
          this.commonUtils.presentToast('error', err);
          this.passwordLoading = false;
      }
    );
  }

// ----------- destroy subscription start ---------
  ngOnDestroy() {
   
  }
// destroy subscription end
}


