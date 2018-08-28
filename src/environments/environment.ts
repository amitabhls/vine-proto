// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  firebase : {
    apiKey: 'AIzaSyDzQCDPfbF7a-s1cCtgqk_T40rHSN6HpzA',
    authDomain: 'ionic-4-vine.firebaseapp.com',
    databaseURL: 'https://ionic-4-vine.firebaseio.com',
    projectId: 'ionic-4-vine',
    storageBucket: 'ionic-4-vine.appspot.com',
    messagingSenderId: '234309026687'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
