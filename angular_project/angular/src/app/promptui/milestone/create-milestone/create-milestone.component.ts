import { Component, OnInit } from '@angular/core';
import { DynamicFormService } from 'src/app/dynamic-form.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Task } from '../milestone.component';


class TaskClass implements Task {
  title = '';
  subtask_ids!: string[];
  id! : string;
  description = '';
}

@Component({
  selector: 'app-create-milestone',
  templateUrl: './create-milestone.component.html',
  styleUrls: ['./create-milestone.component.scss']
})
export class CreateMilestoneComponent implements OnInit {

  constructor(private formService: DynamicFormService){}

  milestone! : FormGroup;
  labelsMilestone:any
  selectedLanguage = "english";
  
  ngOnInit() {

    this.milestone = this.formService.createForm(TaskClass);
    this.labelsMilestone = this.formService.getFormLabels(TaskClass, this.selectedLanguage)

    console.log('Milestone FormGroup:', this.milestone);
    console.log('Labels Milestone:', this.labelsMilestone);
    
  }

  onSubmit(){

  }
}
