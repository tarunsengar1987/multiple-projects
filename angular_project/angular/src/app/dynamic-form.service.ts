import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor(private fb: FormBuilder,private languageservice: LanguageService) {}

  //you need to create a hidden input in the html too
  addField(form: FormGroup, fieldName: string, value: any){
    form.addControl(fieldName, new FormControl(value));
  }

  //use this if you created the form from an object class to add hidden fields
  setFieldValue(form: FormGroup, key: string, value: string) {
    form.get(key)?.patchValue(value);
  }

  //create from Type
  createForm<T extends object>(dataClass: { new (...args: any[]): T }): FormGroup { 
    const instance = new dataClass();
    const formGroup = this.fb.group({});

    Object.keys(instance).forEach((key) => {
      /*
      if(key.indexOf("_container") !== -1){

      }else
      {
        formGroup.addControl(key, new FormControl((instance as any)[key]));
      }  
        */
      formGroup.addControl(key, this.fb.control((instance as any)[key]));
    });

    return formGroup;
  }

  getFormLabels<T extends object>(dataClass: { new (...args: any[]): T }, language: string): { [key: string]: string } {
    const instance = new dataClass();
    const labels: { [key: string]: string } = {};

    Object.keys(instance).forEach((key) => {
      if (key.indexOf("_container") !== -1) {
        
      }
      else{
        labels[key] = this.languageservice.getFormLabel(language, key);
      }
    });

    return labels;
  }

  //create from existing object
  createFormGroupFromObject<T extends object>(obj: T): FormGroup {
    const formGroup = this.fb.group({});

    Object.keys(obj).forEach((key) => {
      // const label = this.languageservice.getFormLabel(language, key);
      // formGroup.addControl(label, new FormControl((obj as any)[key]));
      console.log("field added", key);
      formGroup.addControl(key, this.fb.control((obj as any)[key]));
    });

    return formGroup;
  }
}
