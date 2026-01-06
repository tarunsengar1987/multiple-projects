// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  getApiUrl: () => 'http://localhost:8080', //https://app.doings.de/api / http://localhost:8080
  getPythonBEUrl : () => 'http://127.0.0.1:5000',
  getPythonWSUrl : () => 'ws://127.0.0.1:5000',
  clientId: "291995627781-a4v803r4ribpm2jrk50eidpcjnd075o1.apps.googleusercontent.com",
  getBaseLink: () => 'http://localhost:4200',
  getCookieSecure: () => false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
