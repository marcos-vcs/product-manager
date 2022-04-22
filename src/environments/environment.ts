// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'product-manager-dbb81',
    appId: '1:444956294922:web:02d06dae2d2a497ed384f3',
    storageBucket: 'product-manager-dbb81.appspot.com',
    apiKey: 'AIzaSyCWKXaSXTK0iGpijkupBOSvQYRll8F_zrQ',
    authDomain: 'product-manager-dbb81.firebaseapp.com',
    messagingSenderId: '444956294922',
    measurementId: 'G-M6GHH1D9H4',
  },
  production: false,
  api: 'http://localhost:8080/api/product-manager'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
