import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppUser } from 'src/app/model/appuser.model';
import { DynamicFormService } from 'src/app/dynamic-form.service';
import { LanguageService } from 'src/app/language.service';
import { HttpService } from 'src/app/http.service';
import { SharedEventService } from 'src/app/shared-event.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  selectedLanguage="english";
  labels: { [key: string]: string } = {};
  constructor(private formService: DynamicFormService,private languageservice:LanguageService,private http:HttpService,private eventservice:SharedEventService){}

  formUser!: FormGroup;

  ngOnInit(): void {
    this.formUser = this.formService.createForm(AppUser);
    this.labels = this.formService.getFormLabels(AppUser, this.selectedLanguage)
    this.setLabels();
  }

  setLabels(): void {
    Object.keys(this.formUser.controls).forEach(key => {
      this.labels[key] = this.languageservice.getFormLabel(this.selectedLanguage, key);
    });
  }

  onSubmitUser(){
    const user = this.formUser.value as AppUser;
    console.log(user);
    this.http.createUser(user);
    if(user){
      this.eventservice.openSnackBar('User Created successfully', 'Close');
    }
  }
  

}
