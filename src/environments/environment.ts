// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    apiKey: "AIzaSyDoNvvSA3xIsGemBdZHDvH1it3wHoP7lPo",
    authDomain: "product-manager-e4e65.firebaseapp.com",
    projectId: "product-manager-e4e65",
    storageBucket: "product-manager-e4e65.appspot.com",
    messagingSenderId: "879513176811",
    appId: "1:879513176811:web:56e81fb6ed98cdf21dccae",
    measurementId: "G-MXCN48KSSN"
  },
  production: false,
  api: 'http://localhost:8080/api/',
  supplier: 'supplier-manager',
  product: 'product-manager',
  client: 'client-manager',
  user: 'user'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
