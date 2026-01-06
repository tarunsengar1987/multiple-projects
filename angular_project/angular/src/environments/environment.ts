// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Default file for PRODUCTION

export const environment = {
  production: false,
  getApiUrl: () => 'https://app.doings.de/api', //https://app.doings.de/api / http://localhost:8080 //Java Backend
  getPythonBEUrl : () => 'https://app.doings.de/python', //Python Backend
  getPythonWSUrl: () => 'wss://stg.doings.de',
  clientId: "291995627781-a4v803r4ribpm2jrk50eidpcjnd075o1.apps.googleusercontent.com",
  getBaseLink: () => 'https://app.doings.de',
  getCookieSecure: () => true
};
