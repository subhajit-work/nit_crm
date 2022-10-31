import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PopoverController, Platform, ModalController, MenuController, AlertController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PaginationService } from '../../services/pagination.service';
import { SelectColumnPopoverPage } from '../../my-component/select-column-popover/select-column-popover.page';
import { CommonUtils } from '../../services/common-utils/common-utils';

import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-social-posts',
  templateUrl: './social-posts.page.html',
  styleUrls: ['./social-posts.page.scss'],
})

export class SocialPostsPage implements OnInit, OnDestroy{
  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  // variable declartion section
  model: any = {};
  isListLoading = false;
  page = 1;
  noDataFound = true;
  fetchItems;
  tableHeaderData;
  tableHeaderDataDropdown;
  private itemsSubscribe: Subscription;
  private itemsHeaderSubscribe: Subscription;
  private getListSubscribe: Subscription;
  private deleteListSubscribe: Subscription;
  private sub_ModuleSubscribe: Subscription;
  
  editStatusID;
  current_url_path_name;
  tableheaderDropdown;
  tableheaderDropdownChecked;
  listing_url;
  delete_url;
  selectLoading;
  toggleShow;
  showClickEl;
  toggleMobileSearch;
  headerUrlapi;

  permissionArray;
  loggedin_user_id;
  get_user_dtls;
  

  // ......check uncheck start....
  itemcheckClick = false;
  checkedList = [];
  allselectModel;
  // check uncheck end

  // url variable
  urlType;
  urlId;
  pageUrlName;
  urlEmpId;

  // api parms
  api_parms: any = {};
  urlIdentifire = '';
  parms_action_id: any;
  sub_Module: string;
  subModulData: any;
  list: any;
  _id: any;

  constructor(
    private plt: Platform,
    private pagerService: PaginationService,
    private popoverController: PopoverController,
    private alertController : AlertController,
    private modalController : ModalController,
    private storage: Storage,
    private authService: AuthService,
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private http : HttpClient,
    public menuCtrl: MenuController,
    private commonUtils: CommonUtils // common functionlity come here
  ) { }
    
    // pager object
    pager: any = {};
    // paged items
    pageItems: any[];

    listAlldata;
    
    // ------ init function call start -------
      commonFunction(){

        console.log('common');
        
        // get active url name
        this.current_url_path_name =  this.router.url.split('/')[1] + 'ColumnSelect';
        this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);
        this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
        console.log('this.parms_action_id', this.parms_action_id);
        this._id = this.activatedRoute.snapshot.params.id;
        console.log(" Id ........",this._id);
        this.getsub_Module();
        // User detailsls get
        this.authService.globalparamsData.subscribe(res => {
          if(res != null || res != undefined){
            this.get_user_dtls = res.user;
            console.log('this.get_user_dtls aaa11 >>>>>>>>>>', this.get_user_dtls);
          }
        });

        // table header data url name
        this.headerUrlapi = 'social-media-header';
    
        // table list data url name
        this.listing_url = 'social-media-list';

        // delete url
        this.delete_url = 'social-media-delete';


        this.onHeaderData(this.headerUrlapi);
        
        // getlist data url name

      

        
        this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire); 

        let curentDate = new Date();
        this.setStartdate = moment(curentDate).format('DD/MM/YYYY');

        // menu show
        this.menuCtrl.enable(true);

        setInterval(() => {
          this.curentDate = new Date();
        }, 1);
      }

      // init
      ngOnInit() {
        
      }
    // init function call end

    ionViewWillEnter() {
      this.commonFunction();
      // menu show
      this.menuCtrl.enable(true);


      //----- menu permission data start-----
      this.itemsSubscribe = this.commonUtils.menuPermissionObservable.subscribe(data => {
        if(data){
          let getpermissionArray = data[this.router.url];
          if(getpermissionArray){
            if(getpermissionArray.page_permissions != undefined){

             for(let permission of getpermissionArray.page_permissions) {
                if(permission.permission_name == 'access' && permission.permission_access > 0){
                  this.permissionArray = getpermissionArray.page_permissions;
                  this.loggedin_user_id = getpermissionArray.loggedin_id;
                  this.commonFunction();
                  break;
                }else{
                  console.log('-------No Permission--------');
                }
              }

            }else{
              console.log('-------No Permission--------');
            }
          }
          
        }
      })
      //menu permission data end-----
    }

    // --------- table header function -----------
    onHeaderData(_header_url) {
      this.plt.ready().then(() => {
        this.itemsHeaderSubscribe = this.commonUtils.headerListData(_header_url).subscribe(
          resData => {
          this.tableHeaderData = resData[0];
          this.tableheaderDropdownChecked = resData[1];
          this.tableHeaderDataDropdown = resData[2];

          // ---- get stroage value for select dropdown start----
          this.storage.get(`${this.current_url_path_name}`).then((_stroageVal) => {
            if (_stroageVal != null ) {
              this.tableHeaderData = _stroageVal;

              this.tableHeaderDataDropdown.forEach((value, index) => {
                _stroageVal.forEach((value2, index2) => {
                  if (value.column_name === value2.column_name) {
                      if (value2.is_checked == true) {
                        value.is_checked = true;
                      }
                    }
                });
              });

            } else {
              this.tableheaderDropdownChecked.forEach((value, index) => {
                value.is_checked = true;
              });
            }
          });
        },
        errRes => {
        }
        );
      });
    }

    // --------- table list data function ---------
    onListData(_list_url, _displayRecord, _page, _apiParms, _search, _cherecterSearch, _orderBy, _order, _advSearchParms, _identifire) {
      this.plt.ready().then(() => {
        this.isListLoading = true;
        this.itemsSubscribe = this.commonUtils.fetchList(_list_url, _displayRecord, _page, _apiParms,  _search, _cherecterSearch, _orderBy, _order, _advSearchParms, _identifire).subscribe(
          resData => {
            console.log('resData>>>>>', resData);
          this.isListLoading = false;
          this.fetchItems = resData[0];
          this.listAlldata = resData[1];
          console.log('fetchItems>>>>>', this.fetchItems);

          //---------  check item show start ----------
          if(this.fetchItems && this.checkedList){
            for (let i = 0 ; i < this.fetchItems.length; i++) {
              for (let j = 0 ; j < this.checkedList.length; j++) {
                if(this.checkedList[j].id ==  this.fetchItems[i].id){
                  this.fetchItems[i].isSelected = true;
                }
              }
            }
          }
          // check item show end

          // show pager 
          if(resData[1] != undefined || resData[1] != null){
            this.pager = this.pagerService.getPager(resData[1].total, _page, _displayRecord);
          }
      
        },
        errRes => {
          this.isListLoading = false;
        }
        );
      });
    }

    // -------- pagination -------------
      pageNo = 1;
      setPage(page: number) {
        // get pager object from service
        this.pageNo = page;

        this.pager = this.pagerService.getPager(this.listAlldata.total, page, this.displayRecord);

        this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);

      }
    // pagination end


    // ----------- table header sorting start ----------------
      sortColumnName = '';
      sortOrderName = '';
      isSortTableHeader(_tableHeaderData,  _headerItem ){

        // all field reset first
        _tableHeaderData.forEach((val) => {
          val.sortingButtonName = ''
        })

        _headerItem.orederShow = !_headerItem.orederShow;
        if(_headerItem.orederShow) {
          _headerItem.sortingButtonName = "asc";
        }else
        {
          _headerItem.sortingButtonName = "desc";
        }

        this.sortColumnName = _headerItem.column_name;
        this.sortOrderName = _headerItem.sortingButtonName;

        this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);

      }
    // table header sorting end

    // ------ popover select table header column start--------
      async openColumnselection(ev) {
        const popover = await this.popoverController.create({
        component: SelectColumnPopoverPage,
        componentProps: {
        popover_header_data : this.tableHeaderData,
        popover_header_data_dropdown : this.tableHeaderDataDropdown,
        current_url_name: this.current_url_path_name
        },
        event: ev,
        translucent: true
        });
        
        // dismiss link fire
        popover.onDidDismiss()
        .then((getdata) => {
        if(getdata.role == 'resetPopover'){
        // table header data url name
        this.onHeaderData(this.headerUrlapi);
        }
        });
        
        popover.present();
        
        }
    // popover select table header column end

    // ------- display record start-------
      displayRecord = this.commonUtils.displayRecord;
      displayRecords = this.commonUtils.displayRecords;
      displayRecordChange(_record) {
        this.displayRecord = _record;

        this.onListData(this.listing_url, this.displayRecord, 1, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);

      }
    // display record end

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
      companyList;
      countryList;
      stateList;

      onChange(_item){
        console.log("dropdown selected item >", _item);
      }

      getlist(_getlistUrl){
        this.plt.ready().then(() => {
          this.selectLoading = true;
          this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
            resData => {
              this.selectLoading = false;
            },
            errRes => {
              this.selectLoading = false;
            }
          );
        });
      }
    // getlist data fetch end

    getsub_Module(){
      this.sub_Module = "get-modules-permission/"+this._id;
      this.sub_ModuleSubscribe = this.http.get(this.sub_Module).subscribe(
        (res:any) => {
          if(res.return_status > 0){
            console.log("sub_Module_data>>>>>",res);
            this.subModulData = res.return_data;
            for (let i = 0; i < this.subModulData.length; i++) {
              if(this.subModulData[i].sub_module_name == "List"){
                this.list = this.subModulData[i].p_list;
              }
            }       
          }
        },
        errRes => {
  
        }
      );
    }

    // ------------searchbar start------------------
      searchTerm:string = '';
      searchList(event){
        this.searchTerm = event.target.value;

        this.onListData(this.listing_url, this.displayRecord, 1, this.api_parms, this.searchTerm, '',  this.sortColumnName, this.sortOrderName, '', this.urlIdentifire);

      }
    // searchbar end

    // ------------cherecter search start------------------
      cherecterSearchTerm:string = '';
      searchByCherecter(event){
        this.cherecterSearchTerm = event.target.value;

        this.onListData(this.listing_url, this.displayRecord, 1, this.api_parms, '', this.cherecterSearchTerm,  this.sortColumnName, this.sortOrderName, '', this.urlIdentifire);

      }
    // cherecter search end

    //------- advance search -------
      advanceSearchParms = '';
      onSubmitAdvanceForm(form:NgForm){
        this.advanceSearchParms = form.value;
        if(!form.valid){
          return;
        }else{
          this.onListData(this.listing_url, this.displayRecord, 1, this.api_parms, '', '',  this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);

        }
      }
    // advance search end

    // -----datepicker start------
      curentDate = new Date();
      setmydate;
      datePickerObj: any = {
        dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
        closeOnSelect: true
      };
      myFunction(){
        console.log('get seleted date')
      }
    // datepicker end

    //------------  custom refresh page start ----------
    onRefreshPage(event){
      event.preventDefault();
      event.stopPropagation();

      this.checkedList = [];
      this.allselectModel = false;

      this.advanceSearchParms = '';
      this.searchTerm = '';
      this.sortColumnName = '';
      this.sortOrderName = '';

      // shorting reset
      this.tableHeaderData.forEach((val) => {
        val.sortingButtonName = '',
        val.orederShow = false;
      })

      this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, '', '', '', '', '', this.urlIdentifire);

    }
    // custom refresh page end

    // ---------------- Click Delete Item start ---------------------
      deleteLodershow = false; 
      alldeleteLoaderShow = false;
      async onClickDeleteItem(_identifire, _item, _items, _index){

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

                // ------------ single item delete start ------------
                if(_identifire == 'single'){
                  
                  _item.deleteLodershow = true;
                  this.deleteListSubscribe = this.http.post(this.delete_url+'/'+_items, '').subscribe(
                  (res:any) => {
                    _item.deleteLodershow = false;
                    if(res.return_status > 0){
                      this.commonUtils.presentToast('success', res.return_message);
                      this.commonFunction();
                      if(_items.length == 0){
                        this.allselectModel = false;
                      }
                    }else{
                      this.commonUtils.presentToast('error', res.return_message);
                    }
                  }); 
                // ------------ single item delete end ------------
                }
                
    
              }
            }
          ]
        });
    
        await alert.present();

      }
    // Click Delete Item end


    // ================== select checkbox start =====================
      onCheckboxSelect(option, event) {
        if (event.target.checked) {
          if (this.checkedList.indexOf(option) === -1) {
            this.checkedList.push(option);
          }
        } else {
            for (let i = 0 ; i < this.fetchItems.length; i++) {
              if (this.checkedList[i] == option) {
                this.checkedList.splice(i, 1);
            }
          }
        }

        if (this.fetchItems.length <= this.checkedList.length) {
        this.allselectModel = true;
        console.log('length 4');
        } else {
          console.log('length 0');
          this.allselectModel = false;
          this.itemcheckClick = true;

        }

        console.log('checked item single >>', this.checkedList);
      }

      allSelectItem(event) {

        if (event.target.checked) {
          this.itemcheckClick = false;
          for (let i = 0 ; i < this.fetchItems.length; i++) {
            if (this.checkedList.indexOf(this.fetchItems[i]) === -1 && this.fetchItems[i] !== null) {
              this.checkedList.push(this.fetchItems[i]);
              this.fetchItems[i].isSelected = true;

            }
          }
        } else if (this.itemcheckClick == false) {
          this.checkedList = [];
          for (let i = 0 ; i < this.fetchItems.length; i++) {
            if (this.checkedList.indexOf(this.fetchItems[i]) === -1)
            {
              this.fetchItems[i].isSelected = false;

            }
          }
        }

        console.log('checked item all @@ >>', this.checkedList);
      }
    // select checkbox end

    // ----- click item hilight back start ----
     activeHighlightIndex;
     clickItemHighlight(index){
       this.activeHighlightIndex = index;
     }
    //click item hilight back end 

    // --------------- enable disable call start ---------------------
    statusChangeLoading;
    enabledDisabled( _identifire, _item, _id, _items ){
      //if _status is 0 then its set to 1 and vice versa
      console.log("social id...",_id);
      
      let getStatus;
      let set_api;
      if(_identifire == 'single'){
        if(_item.status == 'Inactive'){
          getStatus = 'Active';
        }else{
          getStatus = 'Inactive';
        }
        set_api = 'social-media-status/'+_id;
      }else{
        let checkItemIdArray = [];
        if(this.checkedList){
          this.checkedList.forEach(element => {
            checkItemIdArray.push(element.id);
          });
        }
      }

      this.statusChangeLoading = true;
      this.itemsSubscribe = this.http.post(set_api, '').subscribe(
        (res:any) => {
          if(res.return_status > 0)
          {
            this.statusChangeLoading = false;
            this.commonUtils.presentToast('success', res.return_message);

            if(_identifire == 'single'){
              if(_item.status == 'Inactive'){
                _item.status = 'Active';
              }else{
                _item.status = 'Inactive';
              }
            }else{
              if(_item == 'Inactive'){
                for (let i = 0 ; i < this.fetchItems.length; i++) {
                  for (let j = 0 ; j < this.checkedList.length; j++) {
                    if ( this.fetchItems[i].id == this.checkedList[j].id ) {
                      this.fetchItems[i].status = 'Inactive';
                      this.fetchItems[i].isSelected = false;
                      break;
                    }
                  }
                }
              }else{
                for (let i = 0 ; i < this.fetchItems.length; i++) {
                  for (let j = 0 ; j < this.checkedList.length; j++) {
                    if ( this.fetchItems[i].id == this.checkedList[j].id ) {
                      this.fetchItems[i].status = 'Active';
                      this.fetchItems[i].isSelected = false;
                      break;
                    }
                  }
                }
              }
              this.checkedList = [];
            }


          }else{
            this.statusChangeLoading = false;
            this.commonUtils.presentToast('error', res.return_message);
          }
        },
        errRes => {
          this.statusChangeLoading = false;
        }
      );
    }
  // enable disable call end

    // ----------- destroy subscription start ---------
      ngOnDestroy() {
        if(this.itemsSubscribe !== undefined){
          this.itemsSubscribe.unsubscribe();
        }
        if(this.itemsHeaderSubscribe !== undefined){
          this.itemsHeaderSubscribe.unsubscribe();
        }
        if(this.getListSubscribe !== undefined){
          this.getListSubscribe.unsubscribe();
        }
        if(this.deleteListSubscribe !== undefined){
          this.deleteListSubscribe.unsubscribe();
        }
        if(this.sub_ModuleSubscribe !== undefined){
          this.sub_ModuleSubscribe.unsubscribe();
        }
      }
    // destroy subscription end

}
