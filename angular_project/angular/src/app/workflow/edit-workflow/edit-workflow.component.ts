import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicFormService } from 'src/app/dynamic-form.service';
import { HttpService } from 'src/app/http.service';
import { AutomationAgent } from 'src/app/model/agent.model';
import { ApiEndpoint } from 'src/app/model/api.model';
import { LanguageService } from 'src/app/language.service';
import { SharedEventService } from 'src/app/shared-event.service';

@Component({
  selector: 'app-edit-workflow',
  templateUrl: './edit-workflow.component.html',
  styleUrls: ['./edit-workflow.component.scss']
})
export class EditWorkflowComponent implements OnInit {

  @Input() data: any;
  agents : AutomationAgent[] = [];
  chosenAgents : AutomationAgent[] = [];
  addAgentForm = false;
  form!: FormGroup;
  keysToHide = ["api_endpoints","id", "ai_endpoint", "body", "selectedItems", "buckets", "context", "parameters", "agentType"];
  selectedLanguage = "english";
  labels!: { [key: string]: string };
  

  constructor(private http: HttpService, private formService: DynamicFormService,private languageservice:LanguageService,private eventservice:SharedEventService){}

  ngOnInit(): void {
    this.form = this.formService.createForm(AutomationAgent);
    this.labels = this.formService.getFormLabels(AutomationAgent, this.selectedLanguage)
    this.formService.setFieldValue(this.form, "agentType","PROMPT");

    for(let agent of this.data.wf.agents){

      for(let endpoint of agent.api_endpoints){
        (endpoint as ApiEndpoint).authHeader = this.http.getAllAuthHeaders();
      }

      this.agents.push(
        new AutomationAgent(
          agent.id,
          agent.name,
          agent.ai_endpoint,
          agent.prompt,
          agent.api_endpoints,
          agent.agentType,
          agent.skills,
          agent.context,
          agent.parameters,
          agent.body,
          agent.buckets,
          agent.inputs
        )
      );
    }
    this.setLabels();
  }

  setLabels(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.labels[key] = this.languageservice.getFormLabel(this.selectedLanguage, key);
    });
  }

  onSubmit() {
    let agent = this.form.value as AutomationAgent;
    const formValue = { ...this.form.value };
    
    /*
    this.http.put("agent",agent).subscribe(data => {
      
    });
    */

    //todo add agent directly to this workflow list (saves when closed)
    if(agent.api_endpoints == null) agent.api_endpoints = [];
    if(agent.buckets == null) agent.buckets = [];

    this.agents.push(new AutomationAgent(agent.id, agent.name, agent.ai_endpoint, agent.prompt, agent.api_endpoints, agent.agentType, agent.skills, agent.context, agent.parameters, agent.body, agent.buckets, agent.inputs));
    this.data.wf.agents = this.agents;
  }

  orderChanged(list : any){
    this.data.wf.agents = list.container.data as AutomationAgent[];

  }

  saveWorkflow(data:any){
    this.http.saveFlow(data.wf);
    this.eventservice.openSnackBar('Workflow Edited successfully', 'Close');
  }

  addAgent(agents: AutomationAgent[]){

  }

}
