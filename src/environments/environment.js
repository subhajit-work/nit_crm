"use strict";
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
exports.__esModule = true;
exports.environment = {
    production: false,
    apiMaster: '1',
    apiUrl: 'http://192.168.0.197/crm/admin',
    fileUrl: 'http://192.168.0.197/crm'
    /*apiUrl:'https://demo.rnjcs.in/ci/xcelero/admin',
   fileUrl:'https://demo.rnjcs.in/ci/xcelero' */
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.