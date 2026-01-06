import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { Option } from '../model/option.model';
import { AutomationAgent, Workflow, WorkflowsWithContext } from '../model/agent.model';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs';
import { SharedEventService } from '../shared-event.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicFormService } from '../dynamic-form.service';
import { ApiEndpoint } from '../model/api.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../parts/dialog/dialog.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { StateService } from '../state.service';
import { LanguageService } from '../language.service';

export class InfData{
  generated_text : string;
  selectedLanguage = "english";


  constructor(generated_text : string){
    this.generated_text = generated_text;
  }
}

@Component({
  selector: 'app-create-automation',
  templateUrl: './create-automation.component.html',
  styleUrls: ['./create-automation.component.scss']
})
export class CreateAutomationComponent implements OnInit {

  dataSource!: MatTableDataSource<AutomationAgent, MatTableDataSourcePaginator>;
  dataSourceWF!: MatTableDataSource<Workflow, MatTableDataSourcePaginator>;
  displayedColumns: string[] = ["name", "bucketsAsString"];
  displayedColumnsWF: string[] = ["name","description"];
  agentIds : number[] = [];
  funcList: Option[] = [{tooltip:"",apiname:"", name: "execute", values: [{agentIds:this.agentIds}], multi: true }, {tooltip:"",apiname:"", name: "saveFlow", values: [{agentIds:this.agentIds}], multi: true }];
  funcListWF: Option[] = [{tooltip:"",apiname:"", name: "execute", values: [], multi: true }];
  subscription: Subscription = new Subscription();
  wfReadySubscription: Subscription = new Subscription();
  infData : InfData[] = [];
  form!: FormGroup;
  apiEndpoints : ApiEndpoint[] = [];
  keysToHide = ["api_endpoints","id", "ai_endpoint", "body", "selectedItems", "buckets", "context", "parameters", "agentType"];
  selectedAgents : AutomationAgent[] = [];
  workflow : Workflow = new Workflow("Workflow one", []);
  wfWithContext? : WorkflowsWithContext;
  selectedLanguage = "english";
  buttonLabel:any
  tooltipLabel:any
  labels!: { [key: string]: string };

  constructor(private http: HttpService, private eventService: SharedEventService, private formService: DynamicFormService, public dialog: MatDialog, private auth: AuthService, private stateService: StateService, private router: Router,
    private languageservice:LanguageService
  ){
    /* Deprecated?
    this.subscription = this.eventService.tableFunctionExecutedSubject$.subscribe( (data : InfData[]) => {
      this.loadData(data);
      this.openDialog();
    });
    */
    this.wfReadySubscription = this.eventService.workflowManagerSubject$.subscribe( (data: WorkflowsWithContext) => {
      this.wfWithContext = data;
      console.log("WF ready and open dialog", this.wfWithContext);
      this.openDialog();
    });
    this.updateLabel();
  }

  updateLabel(){
    this.funcList.forEach(element => {
      this.buttonLabel = this.languageservice.getLabel(this.selectedLanguage, element.name);
      element.apiname = this.buttonLabel;
      this.tooltipLabel = this.languageservice.getTooltip(this.selectedLanguage, element.name);
      element.tooltip = this.tooltipLabel;
    });
    this.funcListWF.forEach(element => {
      this.buttonLabel = this.languageservice.getLabel(this.selectedLanguage, element.name);
      element.apiname = this.buttonLabel;
      this.tooltipLabel = this.languageservice.getTooltip(this.selectedLanguage, element.name);
      element.tooltip = this.tooltipLabel;
    });
  }

  endpointsSelected(eventEndpoints : ApiEndpoint[]){
    console.log(eventEndpoints);
    this.apiEndpoints = eventEndpoints;
  }

  loadData(data : InfData[]){
    this.infData = data;
    console.log("InfData", this.infData);
  }

  onSubmit() {
    let agent = this.form.value as AutomationAgent;
    const formValue = { ...this.form.value };
    //agent.api_endpoints = this.apiEndpoints;
    //this.formService.setFieldValue(this.form,"api_endpoints");
    agent.api_endpoints = this.form.get("selectedItems")?.value; 
    console.log("endpoints", formValue);
    
    this.http.put("agent",agent).subscribe(data => {
      
    });
  }

  ngOnInit(): void {
    this.form = this.formService.createForm(AutomationAgent);
    this.labels = this.formService.getFormLabels(AutomationAgent, this.selectedLanguage)
    this.formService.addField(this.form, "selectedItems",[]);

    this.formService.setFieldValue(this.form, "agentType","PROMPT");
    console.log("Form: ", this.form);

    this.http.getAllApiEndpoints().subscribe((endpoints : ApiEndpoint[]) => {
      this.apiEndpoints = endpoints;
    });

    this.http.getAllAgents().subscribe((rawAgents : AutomationAgent[]) => {
      let agents : AutomationAgent[] = [];
      console.log("RAW Agents", agents);

      for(let agent of rawAgents){
        let tempAgent = new AutomationAgent(agent.id, agent.name, agent.ai_endpoint, agent.prompt, agent.api_endpoints, agent.agentType, agent.skills, agent.context, agent.parameters, agent.body, agent.buckets, agent.inputs);
        tempAgent.bucketsAsString = "";
        for(let bucket of agent.buckets){
          tempAgent.bucketsAsString += "<a href=\"bucketdetails\\"+ bucket.bucketname +"\">" + bucket.bucketname + "</a><br>"
        }
        agents.push(tempAgent);
        this.agentIds.push(agent.id);
      }

      /*
      rawAgents.forEach(agent => {
        let tempAgent = new AutomationAgent(agent.id, agent.name, agent.ai_endpoint, agent.prompt, agent.api_endpoints, agent.agentType, agent.skills, agent.context, agent.parameters, agent.body, agent.buckets);
        tempAgent.bucketsAsString = "bla";
        agents.push(tempAgent);
        this.agentIds.push(agent.id);
      });
      */

      this.dataSource = new MatTableDataSource<AutomationAgent>(agents);
    });
    console.log("Init agentIds", this.agentIds);

    this.http.getAllWorkflows().subscribe((rawWorkflows : Workflow[])  => {
      let workflows : Workflow[] = [];

      rawWorkflows.forEach(wf => {
        let promptString = "Trigger: manual \n";
        let i = 1;
        wf.agents.forEach(agent => {
          if(agent.prompt == "") agent.prompt = "Prompt for Agent missing!";
          promptString += i + ". " + agent.prompt +"\n";
          i++;
        });
        workflows.push(new Workflow(wf.name, wf.agents, promptString, wf.id))
      });
      this.dataSourceWF = new MatTableDataSource<Workflow>(workflows);
    });
  }

  handleSelectionChange(eventAgents : AutomationAgent[]){
    this.funcList[0].values[0] = [];
    this.funcList[1].values[0] = [];
    this.funcList[1].values[0]["agents"] = [];
    this.selectedAgents = eventAgents;
    this.workflow.agents = eventAgents;
    
    eventAgents.forEach(eventAgent => {
      this.funcList[0].values[0].push(eventAgent); //adding the selectedIds of the Automation Agents to args
      this.funcList[1].values[0].push(eventAgent); //same for the save action
    });
    this.funcList[1].values[1] = this.workflow.name;
    console.log(this.funcList[1]);
  }

  //ToDo refactor, because same method is in prompt component
  generatePromptId(text: string): string {
    const unixTimestampSeconds = Math.floor(new Date().getTime() / 1000);
    const user = this.auth.me();

    return text.substring(0, 8).replace(/\s/g, '') + unixTimestampSeconds + "_" + user["user"]["id"]; // Take the first 8 characters as the unique identifier
  }

  handleSelectionChangeWF(eventWFs : Workflow[]){
    console.log(eventWFs);
    this.funcListWF[0].values[0] = [];
    this.funcListWF[0].values[1] = this.generatePromptId(eventWFs[0].agents[0].prompt);
    
    eventWFs.forEach(eventWF => {
      this.funcListWF[0].values[0].push(eventWF);
    });
    console.log("WF FuncList", this.funcListWF[0]);
  }

  orderChanged(list : any){
    this.funcList[0].values[0] = list.container.data as AutomationAgent[];
    this.funcList[1].values[0]["agents"] = list.container.data as AutomationAgent[];
    console.log("Fire!", list, this.funcList[1].values);
  }

  openDialog(): void {
    //TODO deprecated
    /*
    const dialogRef = this.dialog.open<DialogComponent, WorkflowsWithContext>(DialogComponent, {
      data: this.wfWithContext,
      width: '800px', 
      height: '600px' 
    });
    */

    this.stateService.setState(this.wfWithContext);
    this.router.navigate(["/prompt"]);
  }
}
