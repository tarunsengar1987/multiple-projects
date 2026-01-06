import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { AutomationAgent, Workflow, WorkflowsWithContext } from '../model/agent.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { StateService } from '../state.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../parts/dialog/dialog.component';
import { AddBucketComponent } from '../buckets/add-bucket/add-bucket.component';
import { AddEndpointsComponent } from '../endpoints/add-endpoints/add-endpoints.component';
import { ApiEndpoint } from '../model/api.model';
import { Bucket } from '../model/bucket.model';
import { EditWorkflowComponent } from './edit-workflow/edit-workflow.component';
import { BucketDetailsComponent } from '../buckets/bucket-details/bucket-details.component';
import { CreateWorkflowComponent } from '../create-workflow/create-workflow.component';
import { SharedEventService } from '../shared-event.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {
  FolderTooltip = "Folder";
  ApiTooltip = "Api";
  ToolsTooltip = "Tool";
  searchText = '';
  workflows? : Workflow[];
  editingPrompt = false;
  editingContext = true;
  originalPromptText : string = "";
  originalContextText : string = "";
  
  constructor(private http: HttpService, public router: Router, private auth: AuthService, public stateService: StateService, private dialog: MatDialog,
    private eventservice:SharedEventService){}

  createWorkflow(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "Create Workflow",
        component: CreateWorkflowComponent
      }
    });
  }

  countTools(agent: AutomationAgent){
    let toolCount = 0;
    for(let endpoint of agent.api_endpoints){
      if(endpoint.istool) toolCount++;
    }
    return toolCount;
  }

  generatePromptId(text: string): string {
    const unixTimestampSeconds = Math.floor(new Date().getTime() / 1000);
    const user = this.auth.me();

    return text.substring(0, 8).replace(/\s/g, '') + unixTimestampSeconds + "_" + user["user"]["id"]; // Take the first 8 characters as the unique identifier
  }

  ngOnInit(): void {
    //this.http.accessPythonBackendTest();

    this.http.getAllWorkflows().subscribe(workflows => {
      let wfs : Workflow[] = [];
      for(let raw of workflows){
        wfs.push(new Workflow(raw.name, raw.agents, raw.description, raw.id));
      }
      this.workflows = wfs;
      console.log("AGENT NAME 1816 ", this.workflows[0].agents[0].getName());
    });
  }

  editWorkflow(wf: Workflow){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: wf.name,
        component: EditWorkflowComponent,
        componentData: {
          data : { //needs an @Input() data: any; in INNER component
            wf: wf
          }
        }
      }
    });
  }

  bucketDetails(bucketName: string){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "Edit Bucket: " + bucketName,
        component: BucketDetailsComponent,
        componentData: {
          data : {
            bucketName: bucketName
          }
        }
      }
    });
  }

  editPrompt(agentId: number, event: any){
    const target = event.target as HTMLTextAreaElement;
    if (target && target.value != this.originalPromptText) {
      this.editingPrompt = true;
      this.http.editPrompt(agentId, target.value).subscribe( data => {
        this.editingPrompt = false;
        this.eventservice.openSnackBar('Changed the PROMPT', 'Close');
      });
    }
  }

  editContext(agentId: number, event: any){
    const target = event.target as HTMLTextAreaElement;
    if (target && target.value != this.originalPromptText) {
      this.editingContext = true;
      this.http.editContext(agentId, target.value).subscribe( data => {
        this.editingContext = false;
        this.eventservice.openSnackBar('Changed the Dataformat TextArea', 'Close');
      });
    }
  }

  editBuckets(agentId: number, agentName: string, selectedBuckets: Bucket[]){
    this.dialog.open(DialogComponent, {
      data: {
        title: "Add document folder for agent: " + agentName,
        component: AddBucketComponent,
        componentData: {
          data : {
            agentId: agentId,
            selectedBuckets: selectedBuckets
          }
        }
      }
    })

  }

  editAPI(agentId: number, agentName: string, selectedAPIs: ApiEndpoint[]){
    this.dialog.open(DialogComponent, {
      data: {
        title: "Add API for agent: " + agentName,
        component: AddEndpointsComponent,
        componentData: {
          data : {
            agentId: agentId,
            selectedAPIs : selectedAPIs
          }
        }
      }
    })
  }

  goToEndpointDetails(){

  }

}
