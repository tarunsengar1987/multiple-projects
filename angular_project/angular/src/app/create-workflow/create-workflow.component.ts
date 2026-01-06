import { Component, OnInit } from '@angular/core';
import { DynamicFormService } from '../dynamic-form.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Workflow } from '../model/agent.model';
import { HttpService } from '../http.service';
import { LanguageService } from '../language.service';
import { SharedEventService } from '../shared-event.service';

@Component({
  selector: 'app-create-workflow',
  templateUrl: './create-workflow.component.html',
  styleUrls: ['./create-workflow.component.scss']
})
export class CreateWorkflowComponent implements OnInit {

  form!: FormGroup;
  keysToHide : string[] = ["agents"];
  selectedLanguage = "english";
  labels!: { [key: string]: string };

  constructor(private formService : DynamicFormService, private http: HttpService,private languageservice: LanguageService,private eventservice:SharedEventService){

  }


  onSubmit() {
    let workflow = this.form.value as Workflow;
    this.http.saveFlow(workflow);
    this.eventservice.openSnackBar('Workflow Created Successfully', 'Close');
  }

  ngOnInit(): void {
    this.form = this.formService.createForm(Workflow);
    this.labels = this.formService.getFormLabels(Workflow, this.selectedLanguage)
  }

}
