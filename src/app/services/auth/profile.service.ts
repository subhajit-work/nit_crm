import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, from } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';


const API_URL = environment.apiUrl;
const API_MASTER = environment.apiMaster;

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private storage: Storage, 
    private plt: Platform,
    private http : HttpClient,
    private router: Router,
    private location: Location
  ) { }

 

}
