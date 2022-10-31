import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse, HttpParams, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, shareReplay, retry, map, catchError, switchMap } from 'rxjs/operators';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { CommonUtils } from '../common-utils/common-utils';
import { Subscription } from 'rxjs/internal/Subscription';

const API_URL = environment.apiUrl;
const API_MASTER = environment.apiMaster;

/* tslint:disable */ 
@Injectable()
export class InterceptorProvider implements HttpInterceptor {
  isparams = false;

  empId;
  lat;
  lng;
  zoom;
  origin;
  destination;

  private logoutDataSubscribe: Subscription;

  // private _globalparamsData = null;
  private _globalparamsData = new BehaviorSubject(null);

  // get token session master as observable
  get globalparamsData(){
    return this._globalparamsData.asObservable();
  }

  // get token session master as a non observable
  public getTokenSessionMaster() {
    return this._globalparamsData.value;
  }

  constructor(
    private router: Router,
    public toastController: ToastController,
    private storage: Storage,
    private authService : AuthService,
    private commonUtils: CommonUtils,
    private alertController : AlertController,
    private http : HttpClient,
) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Keeps the original request params. as a new HttpParams
    let newParams = new HttpParams({fromString: request.params.toString()});
    let authorization;
    /* const glabalParms = this.storage.get('setStroageGlobalParamsData');
    Promise.all([glabalParms]).then((arrayOfResults) => {
      console.log('arrayOfResults>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> >', arrayOfResults[0]);
      newParams = newParams.append('token', arrayOfResults[0].token);
      newParams = newParams.append('session', arrayOfResults[0].sission1);
      newParams = newParams.append('master', arrayOfResults[0].master1); 
    }); */

   
    let get_global_params = this.authService.getTokenSessionMaster();
    console.log('get_global_params intercepter >>>>>>>>>>>>>>>>', get_global_params);

    // close by apurba start

    // if(get_global_params != null && get_global_params.master == undefined){
    //   // get Site Info
    //   this.commonUtils.getSiteInfoObservable.subscribe(res =>{
    //     // console.log('res interseptor id >>>>>>', res);
    //     if(res){
    //       get_global_params.master = res.id;
    //     }
    //   })
    //   // get_global_params.master = API_MASTER;
    // }
    // close by apurba end

    if(get_global_params != null && get_global_params.master == undefined){
      get_global_params.master = API_MASTER;
    }

    if(get_global_params != null && get_global_params.token !== undefined &&get_global_params.session !== undefined && get_global_params.master !== undefined){
      
      // newParams = newParams.append('token', get_global_params.token);
      // newParams = newParams.append('session', get_global_params.session);
      // newParams = newParams.append('master', get_global_params.master); 

      
    }
    console.log('newParams >>>>>>>', get_global_params);

    // if(get_global_params != null && get_global_params.token !== undefined &&get_global_params.session !== undefined && get_global_params.master !== undefined){
    // if(get_global_params != null && get_global_params.token !== undefined){
      
    //   newParams = newParams.append('token', get_global_params.token);
    //   /* newParams = newParams.append('session', get_global_params.session); */
    //   newParams = newParams.append('master', get_global_params.master); 

    //   // console.log('newParams >>>>>>>', newParams);
    // }
    

    // // Clone the request with params instead of setParams
    // const requestClone = request.clone({
    //   url: `${API_URL}/${request.url}`,
    //   params: newParams
    // });

    if(get_global_params == null || get_global_params.token == null){
      // appKey = API_KEY;
      authorization = 'Bearer'
      console.log('appkey false');
    }else {
      // appKey = API_KEY;
      authorization = 'Bearer '+get_global_params.token;
    }
    
    // Clone the request with params instead of setParams

    // if(appKey) {
      // console.log('appKey', appKey);

      const requestClone = request.clone({
        url: `${API_URL}/${request.url}`,
        setHeaders: {
          // 'APP-KEY': appKey,
          'Authorization': authorization,
        }
      });

  
    // return next.handle(requestClone);
    return next.handle(requestClone).pipe(
      map((event: HttpEvent<any>) => {
        let eventUrl;
        if (event instanceof HttpResponse) {
          // const apiReq = request.clone({ url: `${this.baseUrl}/${request.url}` });
          // this.cache.set(request.url, event);
          /* req.clone({ 
            url: environment.serverUrl + request.url 
          }); */

          // let eventUrl = event.clone({ 
          //   url: API_URL + event.url 
          // });
          // console.log('interceptor return status >>>>', event.body.return_status);

          if(event.body.return_status == 0){
            //this.router.navigateByUrl('/auth');
            // this.authService.logout();
            this.commonUtils.presentToast('error', event.body.return_message);
          }else if(event.body.return_status == 2){
            console.log('Link', event.body);
            this.commonUtils.presentToast('info', event.body.return_message);
            this.empId = event.body.id;
            console.log("Employ Id............", this.empId);
            
            this.logoutAlert();
          }else if(event.body.return_status == 5){
            this.authService.logout();

            this.storage.clear().then(() => {
              console.log('all stroage data cleared');
              this.router.navigateByUrl('/auth');
        
              this._globalparamsData = new BehaviorSubject(null);
              window.location.reload(); //working
        
            });
          }

          //token expire check
          if(event.body.return_token_expire){
            //this.router.navigateByUrl('/auth');
            this.authService.logout();
          }

          //show return_message
          if(!event.body.return_token_expire){
            // this.commonUtils.presentToast('info', event.body.return_message);
          }

        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {

        // this.router.navigateByUrl('/auth');

        console.log("interceptor error handeller >>", error);

        /* const code = error;
        let message = 'Could not sign you up, please try again.';
        if (code === 'EMAIL_EXISTS') {
          message = 'This email address exists already!';
        } else if (code === 'EMAIL_NOT_FOUND') {
          message = 'E-Mail address could not be found.';
        } else if (code === 'INVALID_PASSWORD') {
          message = 'This password is not correct.';
        }
        this.showAlert(message); */

        if (error.status === 0) {
          this.commonUtils.presentToast('error', 'Please Check Your Network Connection!');
          /* this.router.navigateByUrl('/auth');
          console.log('<< please check your network connection! >>'); */
        }else if(error.status === 404){
          this.commonUtils.presentToast('error', 'Could not sign you up, please try again');
        }else if(error.status === 500){
          this.commonUtils.presentToast('error', 'Internal Server Error');
          this.authService.logout();
          this.router.navigateByUrl('/auth');
          /* this.commonUtils.presentToast('success', 'Internal Server Error');
          this.commonUtils.presentToast('info', 'Internal Server Error'); */
        }else if(error.status === 401){
          this.commonUtils.presentToast('error', 'Could not sign you up, please try again');
          this.authService.logout();
          this.router.navigateByUrl('/auth');
        }
        return throwError(error);
      }));
  }

  // reload alert
    async logoutAlert() {
      const reload = await this.alertController.create({
        header: 'Logout',
        message: 'Do you want to logout from other devices?',
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
              this.getUserLocation();
            }
          }
        ]
      });

      await reload.present();
    }
  // reload page end

  // -----------------Get current location start-----------------
  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 16;
        console.log("position", position);
        console.log("this.lat", this.lat);
        console.log("this.lng", this.lng);

        if(this.lat && this.lng){
          this.logoutDataSubscribe = this.http.get('logout?emp_id='+ this.empId+'&latitude='+this.lat+'&longitude='+this.lng).subscribe(
          (res:any) => {
            console.log("Edit data  res >", res.return_data);
            if(res.return_status > 0){
              this.authService.logout();

              this.storage.clear().then(() => {
                console.log('all stroage data cleared');
                this.router.navigateByUrl('/auth');
          
                this._globalparamsData = new BehaviorSubject(null);
                window.location.reload(); //working
          
              });

            }
          },
          errRes => {

          }
        );
        }
      });
    }
  }

  async getDirection() {
    if (typeof this.lat === "undefined" || typeof this.lng === "undefined" || typeof this.zoom === "undefined") {
      await this.getUserLocation();
    }
    this.origin = { lat: this.lat, lng: this.lng };
    
    this.destination = { lat: 22.482124799999998, lng: 88.3359744 };
    console.log(this.origin);
  }
  // -----------------Get current location end

  /* async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      showCloseButton: true,
      animated:true,
      cssClass:"my-tost-custom-class",
      translucent: true,
      duration: 2000
    });
    toast.present();
  } */

  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.logoutDataSubscribe !== undefined){
        this.logoutDataSubscribe.unsubscribe();
      }
    }
  // destroy subscription end
  
  }

  
