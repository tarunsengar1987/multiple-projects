import { Injectable } from '@angular/core';
import { Bucket } from './model/bucket.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private functionLabels: { [language: string]: { [key: string]: string } } = {
    english: {
      navToIntegrations: 'Create integration',
      deleteApi: 'Delete API',
      deleteEndpointConfig:'Delete EndPoint Config',
      deleteEndpoint:'Delete Endpoint',
      createEndpoint:'Create',
      edit:'Edit',
      execute:'Execute',
      saveFlow:'Save',
      configParams:'Configure Parameters',
      Login:'Login User'
    },
    german: {
      navToIntegrations: 'Erstelle Integration',
      deleteApi: 'Erstelle API',
      deleteEndpointConfig:'lösche Endpunkt Konfiguration',
      deleteEndpoint:'lösche Endpunkt',
      createEndpoint:'Erstelle Endpunk',
      edit:'',
      execute:'',
      saveFlow:'',
      configParams:'',
      Login:''
    }
  };

  private tooltipLabels: { [language: string]: { [key: string]: string } } = {
    english: {
      navToIntegrations: 'Create integration',
      deleteApi: 'Delete API',
      deleteEndpointConfig:'Delete EndPoint Config',
      deleteEndpoint:'Delete Endpoint',
      createEndpoint:'Create',
      edit:'Edit',
      execute:'Execute',
      saveFlow:'Save',
      configParams:'Configure Parameters',
      Login:'Click to Login'
    },
    german: {
      navToIntegrations: 'Erstelle Integration',
      deleteApi: 'Erstelle API',
      deleteEndpointConfig:'lösche Endpunkt Konfiguration',
      deleteEndpoint:'lösche Endpunkt',
      createEndpoint:'Erstelle Endpunk',
      edit:'',
      execute:'',
      saveFlow:'',
      configParams:'',
      Login:''
    }
  };

  private formLabel: { [language: string]: {  [key: string]: string  }  }  = {
    english: {
      bucketname: 'Bucket Name',
      objectkey: 'Object Key',
      customer: 'Customer',
      description: 'Description',
      id: 'ID',
      name:'Name',
      baseurl:'Base URL',
      authurl:'Authentication URL',
      authkey:'Authentication Key',
      scope:'Scope',
      endpoints:'EndPoint',
      openapi:'Open API',
      username: 'User Name',
      email: 'Email',
      enabled:'Enabled Status',
      googletoken:'Google Token'
    },
    german: {
      bucketname: 'Bucket Name',
      objectkey: 'Object Key',
      customer: 'Kunde',
      description: 'Description',
      id: 'ID',
      name:'Name',
      baseurl:'Base URL',
      authurl:'Authentication URL',
      authkey:'Authentication Key',
      scope:'Scope',
      endpoints:'EndPoint',
      openapi:'Open API',
      username: 'User Name',
      email: 'Email',
      enabled:'Enabled Status',
      googletoken:'Google Token'      
    }
  }

  constructor() { }

   // change button label
   getLabel(language: string, key: string): string {
    if (this.functionLabels[language] && this.functionLabels[language][key]) {
      return this.functionLabels[language][key];
    } else {
      return key; // Return the key itself if the label is not found
    }
  }

  // change tooltip label
  getTooltip(language: string, key: string): string {
    if (this.tooltipLabels[language] && this.tooltipLabels[language][key]) {
      return this.tooltipLabels[language][key];
    } else {
      return key; // Return the key itself if the label is not found
    }
  }

  getFormLabel(language: string, key: string): string {
    if (this.formLabel[language] && this.formLabel[language][key]) {
      return this.formLabel[language][key];
    } else {
      return key; // Return the key itself if the label is not found
    }
  }
}
