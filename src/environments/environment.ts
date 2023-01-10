// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    apiKey: "AIzaSyDEEXowt-s5wQVxrV17AZVL7BPHEsKqsPs",
    authDomain: "product-manager-22a30.firebaseapp.com",
    projectId: "product-manager-22a30",
    storageBucket: "product-manager-22a30.appspot.com",
    messagingSenderId: "696029692880",
    appId: "1:696029692880:web:fbd8ae4521f536ae652fd5",
    measurementId: "G-66QVKBWGR1"
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
