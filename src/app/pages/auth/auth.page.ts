import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController, MenuController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable, Subscription, from } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { CommonUtils } from '../../services/common-utils/common-utils';
import{ AppComponent } from'../../app.component';
import { environment } from '../../../environments/environment';

/* tslint:disable */ 
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  isLoading = false;
  siteInfo;
  isLogin = true;
  userTypes;

  lat;
  lng;
  zoom;
  origin;
  destination;
  hide: true;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  password:any;
  model:any={}

  private formSubmitSubscribe: Subscription;

  constructor( 
    private authService:AuthService,
    private router:Router,
    private loadingController: LoadingController,
    private http : HttpClient,
    private storage: Storage,
    private alertCtrl: AlertController,
    public menuCtrl: MenuController,
    private commonUtils: CommonUtils,
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    // menu hide
    this.menuCtrl.enable(false);
    this.router.navigateByUrl('/welcome');
    this.formSubmitSubscribe =  this.authService.globalparamsData.subscribe(res => {
      console.log('res>>>>>>>>>>>', res);
      if(res && res != null && res != undefined && res != ''){
        if(res.token){
          this.router.navigateByUrl('/welcome');
        }
      }
    });

    // get Site Info
    this.formSubmitSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      this.siteInfo = res;
    })
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  site_path;
  site_href;
  site_href_split;
  site_path_split;
  ionViewWillEnter() {
    // get Site Info
    this.formSubmitSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      this.siteInfo = res;
    })

    // menu hide
    this.menuCtrl.enable(false);
    this.formSubmitSubscribe =  this.authService.globalparamsData.subscribe(res => {
      if(res && res != null && res != undefined && res != ''){
        if(res.token){
          this.router.navigateByUrl('/welcome');
        }
      }else {
        console.log('From auth page>>', res);
      }
    });
  }


  onSwitchAuthMode(){
    this.isLogin =! this.isLogin;
  }

  //---------------- login form submit start-----------------
    onSubmitForm(form:NgForm){
      this.isLoading = true;
      console.log('form >>', form.value);
      if(!form.valid){
        return;
      }
      const email = form.value.username;
      const password = form.value.password;

      this.authenticate(form, form.value);
      form.reset();
    }

    // authenticate function
    authenticate(_form, form_data) {
      this.isLoading = true;
      this.loadingController
        .create({ keyboardClose: true, message: 'Logging in...' })
        .then(loadingEl => {
          loadingEl.present();
          let authObs: Observable<any>;
          if (this.isLogin) {
            authObs = this.authService.login('login', form_data, '')
          } else {

          }
          this.formSubmitSubscribe = authObs.subscribe(
            resData => {
              console.log('resData =============))))))))))))))>', resData);
              if(resData.return_status > 0)
              {
                console.log('user Type =============))))))))))))))>', resData.return_data.user_type);
                this.router.navigateByUrl('/welcome');

                setTimeout(() => {
                  _form.reset();
                  loadingEl.dismiss();
                }, 2000);
                
              }else{
                loadingEl.dismiss();
                this.commonUtils.presentToast('error', resData.return_message);
              }
              
              this.isLoading = false;
            },
            errRes => {
              loadingEl.dismiss();
            }
          );
        });
    }
  // login form submit end

    private showAlert(message: string) {
      this.alertCtrl
        .create({
          header: 'Authentication failed',
          message: message,
          buttons: ['Okay']
        })
        .then(alertEl => alertEl.present());
    }

// ----------- destroy subscription start ---------
ngOnDestroy() {
  if(this.formSubmitSubscribe !== undefined){
    this.formSubmitSubscribe.unsubscribe();
  }
}
// ---------- destroy subscription end ----------
}
