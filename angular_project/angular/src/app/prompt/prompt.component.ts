import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable, Subscription, interval, takeWhile } from 'rxjs';
import { Edge, Node } from '@swimlane/ngx-graph';
import { AutomationAgent, Workflow, WorkflowsWithContext } from '../model/agent.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiEndpoint } from '../model/api.model';
import { AuthService, clientGetToken } from '../auth.service';
import { AgentEvent } from '../model/agentevent.model';
import { StateService } from '../state.service';
import { MermaidAPI } from 'ngx-markdown';
import { Socket, io } from 'socket.io-client';
import { PromptElementsService } from '../prompt-elements.service';
import { SharedEventService } from '../shared-event.service';
import { environment } from '../../environments/environment';
import { DialogComponent } from '../parts/dialog/dialog.component';
import { BucketDetailsComponent } from '../buckets/bucket-details/bucket-details.component';
import { MatDialog } from '@angular/material/dialog';
import { Bucket } from '../model/bucket.model';
import { AddBucketComponent } from '../buckets/add-bucket/add-bucket.component';

export interface AgentPrompt{
  generated_text: string,
  actions: string
}

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {

  public options: MermaidAPI.Config = {
    logLevel: MermaidAPI.LogLevel.Error,
    securityLevel: MermaidAPI.SecurityLevel.Loose
  };

  private socket?: Socket;
  message?: string;
  response: any;
  accessToken?: string;
  agentId?: number;

  inputs = "";
  answer$ : Observable<AgentPrompt[]> | undefined;
  answer : AgentPrompt = {generated_text:"", actions:""};
  allAnswers : string[] = [];
  reversedAnswers : string[] = [];
  nodes : Node[] = [];
  links : Edge[] = [];
  matchedAgents : AutomationAgent[] = [];
  showSpinner = false;
  agent : AutomationAgent | undefined;
  agentEvents : AgentEvent[] = [];
  @Input() wfsWithContext? : WorkflowsWithContext;
  extraContext = "";
  mermaidNodes = `id0(Drawing graph...)
  click id0 call callback("test")`
  mermaidGraph = `\`\`\`mermaid
flowchart TD
    ${this.mermaidNodes}
  \`\`\``;
  doneAgents : number[] = [];
  inProgressAgents : number[] = [];
  showComponent: boolean = false;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  subscription: Subscription = new Subscription();
  promptId: string = "";
  singleAgentId?: string | undefined;

  VERSION = "45";
  WSS_URL = environment.getPythonWSUrl();

  constructor(
    private http : HttpService, 
    private route: ActivatedRoute, 
    private auth: AuthService, 
    private stateService: StateService,
    private promptElementsService: PromptElementsService,
    private eventService: SharedEventService,
    private dialog: MatDialog
  ){
    this.subscription = this.eventService.humanLoopAnswerSubject$.subscribe( data => {
      this.showComponent = false;
      this.http.sendHumanFeedback(this.promptId, data).subscribe(response => {
        this.eventService.openSnackBar("Answer received","Close");
      });
    });
  }

  addMermaidNode(newContent: string): void {
    this.mermaidNodes += `
${newContent}`;
  }

  //ONLY creating a context menu is allowed here, no data delete / save operations or anything else
  //Very unsafe function so only do something here that you want to allow ANYBODY without access rights
  callback(test: string){
    alert("TEST TEST TEST " + test)
  }

  createLinkedConnection(nodeA: AutomationAgent, nodeB: AutomationAgent, linkNr: number){
    let node = "";

    const allAgents = this.wfsWithContext?.workflows[0].agents;

    //modelling input connections (nodeB is the mode to model, from which node does it get inputs? => arrow connection!)
    if(nodeB.inputs != undefined){
      let inputsArray : number[] = JSON.parse(nodeB.inputs);
      for(let input of inputsArray){ 
        console.log("INPUT", input);
        let preAgent = allAgents?.find(obj => obj.id === input);

        if(preAgent != undefined)
          node += `
          id${input}(${preAgent.name}) --> id${nodeB.id}(${nodeB.name})`;
      }
    }
    else 
      node = `id${nodeA.id}(${nodeA.name}) -.- id${nodeB.id}(${nodeB.name})`;

    return node;
  }

  changeAgentStatusInGraph(agentId: number, done: boolean){
    console.log("Graph event", agentId, done);
    if(done){
      const index = this.inProgressAgents.indexOf(agentId);
      if (index !== -1){ 
        this.inProgressAgents.splice(index,1);
        console.log("Spliced", this.inProgressAgents);
      }
      
      if(this.doneAgents.indexOf(agentId) < 0)
        this.doneAgents.push(agentId);
    } 
    else
      if(this.inProgressAgents.indexOf(agentId) < 0)
        this.inProgressAgents.push(agentId);

    console.log("Redrawing Graph", this.doneAgents, this.inProgressAgents);
    this.createMermaidGraph();
  }

  createMermaidGraph(){
    this.mermaidNodes = ``;
    if(this.wfsWithContext?.workflows[0].agents != undefined){
      const agentCount = this.wfsWithContext?.workflows[0].agents.length;

      if(agentCount > 1){ //no links if only one agent
        let index = 0;
        for(let agent of this.wfsWithContext?.workflows[0].agents){
          
          if(index < agentCount-1){
            const successor = this.wfsWithContext?.workflows[0].agents[index+1];
            let node = this.createLinkedConnection(agent,successor,index)
            console.log("Node added: ", node);
            this.addMermaidNode(node);
          }
          index++;
        }
      }else{
        const nodeA = this.wfsWithContext?.workflows[0].agents[0];
        let node = `id${nodeA.id}(${nodeA.name})`;
        this.addMermaidNode(node);
      }
      
      //------------- progress coloring --------------------
      for(let doneId of this.doneAgents){
        this.mermaidNodes += `
  style id${doneId} fill:#9de099`; //green
      }
  
      for(let progressId of this.inProgressAgents){
        this.mermaidNodes += `
  style id${progressId} fill:#f5d442`; //yellow
      }

      this.mermaidGraph = `\`\`\`mermaid
      flowchart TD
          ${this.mermaidNodes}
\`\`\``; //must be no indent! dont format!

      console.log("Mermaid graph drawn: ", this.mermaidNodes, this.mermaidGraph);
    }
      
  }

  prepareForMermaid(input: string): string {
    const escapedInnerString = input.replace(/`/g, '\\`');
    const completeStringLiteral = `\`\`\`${escapedInnerString}\n\`\`\``
    console.log("Literal", completeStringLiteral);
    return completeStringLiteral
  }

  truncateLabel(label: string): string {
    const maxWidth = 600; // Max width in pixels
    if (label.length > maxWidth / 7) { // Rough estimation of pixel to character ratio
        return label.substring(0, maxWidth / 7 - 3) + '...'; // Subtract 3 for ellipsis
    }
    return label;
  }

  cleanLLMAnswer(stringToClean: string){
    let cleanedString = stringToClean.replace(/```markdown/g, '').replace(/```/g, '');
    return cleanedString;
  }
  
  addHardcodedEvents(){
    this.agentEvents.push(new AgentEvent(1, "comment", ["Dies wäre die Antwort von der KI und soll schön aufbereitet werden"], 0, "message", "Ich bin der prompt..."));
  }

  addHardcodedLLMAnswer(){
    this.allAnswers.push("## Finanzkapitel: TAM, SAM, SOM\n\n### Total Addressable Market (TAM)\nDer Total Addressable Market (TAM) für unsere KI-Automatisierungslösungen wird auf **$235 Milliarden** geschätzt. Dies stellt einen der größten Märkte weltweit dar, mit einer jährlichen Wachstumsrate (CAGR) von 43%. Das enorme Potenzial erstreckt sich über verschiedene Branchen und bietet somit eine bedeutende Wachstums- und Expansionsmöglichkeit.\n\n### Serviceable Addressable Market (SAM)\nDer Serviceable Addressable Market (SAM) beläuft sich auf etwa **$110 Milliarden**. Dieser Markt umfasst die westliche Hemisphäre, die fast 50% des TAM ausmacht. Unsere Prognosen zeigen, dass dieser Markt innerhalb des nächsten Jahres effektiv bedient werden kann, was erhebliche Umsatzchancen bietet.\n\n### Serviceable Obtainable Market (SOM)\nDer Serviceable Obtainable Market (SOM) in der DACH-Region wird auf **$25 Milliarden** geschätzt. Angesichts unserer fortschrittlichen, prozessbereiten agentischen Workflows erwarten wir, innerhalb der nächsten zwei Monate etwa 20% dieses Marktes zu erobern. Diese schnelle Marktdurchdringung unterstreicht unseren Wettbewerbsvorteil und unsere Bereitschaft, in dieser lukrativen Region Wert zu liefern.\n\n\nDiese Marktanalyse bietet eine klare und strukturierte Übersicht über die Marktpotenziale und hilft dabei, die strategischen Entscheidungen für das Projekt zu untermauern.");
  }

  //------------------ Websockets ---------------------------------------

  initializeSocketConnection(token: string, promptId: string): void {
    console.log("Establishing websocket connection...")

    //TODO variable host address for production use
    this.socket = io(this.WSS_URL, { // works => ws://127.0.0.1:5000
      //path: '/socket.io/',   //ws://35.158.225.36  wss://doings-backend-lb-1023377319.eu-central-1.elb.amazonaws.com
      // wss://doings-test2-407467518.eu-central-1.elb.amazonaws.com
      query: {
        token: token,
        promptId: promptId
      },
      transports: ['websocket','polling'],  // Ensure both websocket and 'polling' transports are allowed
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    //------ websocket received ----------------
    this.socket.on('response', (data: any) => {
      //packe generated_text in allAnswers wenn nicht leer
      console.log('Response received2:', data, data["actions"]);

      if(data.actions != undefined && data.actions != ""){

        let action = data.actions;
        let event = new AgentEvent(action.agentId,action.iconName, action.texts, action.lastTextIndex, action.type);

        this.agentEvents.push(event);

        if(event.type === "agent_finish"){
          this.changeAgentStatusInGraph(action.agentId, true);
        }
        else if(event.type === "agent_started")
          this.changeAgentStatusInGraph(action.agentId, false);
        else if(event.type != "notification"){
          //Human in the loop & json visualisations
          this.showComponent = true;
          console.log("Loading component...", event.type);
          this.promptElementsService.loadComponent(event.type, this.container, {generated_text: data.generated_text});
        }

        if(data.generated_text != undefined && data.generated_text != "" && event.type === "agent_finish"){
          console.log("Respone in WFs", data);
          this.allAnswers.push(this.cleanLLMAnswer(data.generated_text));
          
          this.reversedAnswers = [...this.allAnswers].reverse() // Reverse the array
          
        }
      }

    });

    this.socket.on('connect_error', (err: any) => {
      console.error('Websocket Connection Error:', err);
      console.log("WS err descr", err.description);
      console.log("WS err context", err.context);
    });
  }
  //------------------ end Websockets -----------------------------------

  ngOnInit(): void {
    (window as any).callback = this.callback.bind(this);
    console.log(this.VERSION + " | " + this.WSS_URL);
    //this.addHardcodedEvents();
    //this.addHardcodedLLMAnswer();
    //this.showComponent = true;
    //this.promptElementsService.loadComponent("create_gdocEngine", this.container, {generated_text: "TESTDATA"});

    //get doings token
    const token = clientGetToken();
    const wfs = this.stateService.getState();
    console.log("State service", wfs);
    if(wfs != undefined){ // WORKFLOW PROMPT CHAIN
      this.wfsWithContext = wfs;
      this.promptId = wfs.promptId;

      console.log("Starting workflow...");
      this.createMermaidGraph();

      this.inputs = wfs.workflows[0].agents[0].prompt;
      this.stateService.setState(undefined);

      //----> Websockets
      if(token != null) this.initializeSocketConnection(token, wfs.promptId);
      else{
        console.error('Authentication token is missing');
      } 

      this.startWorkflow();
    }
    else if(history.state.agent != undefined)
    {
      this.agent = history.state.agent;
      if(this.agent) this.inputs = this.agent.prompt;
      console.log("Agent found from history...", this.agent);
    }else{ // SINGLE PROMPT AGENT
      this.route.params.subscribe(params => {
        const agentId = params["id"];
        this.agentId = agentId;
        console.log("Querying agent...");
        if(agentId != undefined) this.http.getAgent(agentId).subscribe((agent : AutomationAgent) => {
          console.log("Agent found...", agent);
          agent.api_endpoints.forEach((ep : ApiEndpoint) => {
            console.log("Endpoint authed...", ep);
            this.http.setEndpointAuthHeader(ep);
          });
          this.agent = agent;
          console.log("Agent loaded...", this.agent);
        });
      });
    }
  }

  layoutSettings = {
    orientation: 'TB',
    rankPadding: 40
  };

  getTextHeight(node: any): number {
    let textHeight = node.dimension.height; 
    if (this.matchedAgents[node.id]) {
        textHeight += 15; 
    }
    return textHeight;
  }

  //TODO refactor same code in workflow component
  generatePromptId(text: string): string {
    const unixTimestampSeconds = Math.floor(new Date().getTime() / 1000);
    const user = this.auth.me();

    return text.substring(0, 8).replace(/\s/g, '') + unixTimestampSeconds + "_" + user["user"]["id"]; // Take the first 8 characters as the unique identifier
  }

  findAgentInWfs(agentId : number){
    if(this.wfsWithContext != undefined){
      for(let wf of this.wfsWithContext.workflows){
        for(let agent of wf.agents){
          if(agent.id === agentId) return agent;
        }
      }
    }
    return undefined;
  }

  countAgents(){
    let i = 0;
    if(this.wfsWithContext != undefined){
      for(let wf of this.wfsWithContext.workflows){
        i+= wf.agents.length;
      }
    }
    return i;
  }

  rewindStep(agentEvent : AgentEvent){
    //nutze daten aus dem agent event + eingabetext für neue KI Anfrage
    if(this.wfsWithContext != undefined){
      const agentId = agentEvent.agentId;
      let rewindAgent = this.findAgentInWfs(agentId);

      if(rewindAgent != undefined){
        rewindAgent.prompt = this.inputs + " " + this.extraContext + " " + rewindAgent?.prompt;

        //rewindAgent.prompt = this.inputs + " " + this.allAnswers[agentEvent.lastTextIndex-1];

        //Ergebnis der KI Anfrage muss Abschnittstext ersetzen, fertig
        this.promptAgent(rewindAgent, agentEvent.lastTextIndex-1);
      }
        
      console.log("Rewind", rewindAgent, agentEvent.lastTextIndex-1);
    }
  }

  startWorkflow(){
    if(this.wfsWithContext != undefined)
      this.http.executeFlows(this.wfsWithContext);
  }

  promptAgent(agent = this.agent, indexToReplace?: number){
    const promptId = this.generatePromptId(this.inputs)
    const token = clientGetToken();

    if(token != null) this.initializeSocketConnection(token, promptId);
    else{
      console.error('Authentication token is missing');
    } 
    
    this.showSpinner = true;
    console.log("Answer INPUT", this.answer);

    if(indexToReplace != undefined){
      //KI-Anfrage bezüglich eines bestimmten Kapitels
      this.http.promptAgent(this.inputs, this.answer.generated_text, promptId, agent).subscribe(response => {
        console.log("Chapter targeting Response", this.inputs, this.answer.generated_text, response);
        this.answer = response;
        this.allAnswers[indexToReplace] = this.answer.generated_text;
        this.showSpinner = false;
        console.log("SPINNER", this.showSpinner, this.allAnswers, indexToReplace);
      });
    } 
    else if(agent != undefined){ //<------ Single Agent ------------
      this.http.promptAgent(this.inputs, this.answer.generated_text, promptId, agent).subscribe(response => {
        console.log("Respone in Single Agent", response);
        this.answer = response;
        this.allAnswers.push(response.generated_text);
        this.showSpinner = false;
      });
    }
    else //Deprecated (Single prompt without agent)
      this.http.promptAgent(this.inputs, this.answer.generated_text, promptId).subscribe(response => {
        console.log("Response in ELSE", response);
        this.answer = response;
        this.allAnswers.push(response.generated_text);
        this.showSpinner = false;
      });
  }

  submitForm(event: KeyboardEvent){
    if (event.shiftKey) {

    }
    else if(event.key === 'Enter') {
      console.log("Form submit triggered");
      this.promptAgent();
    }
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

  //refactor: doubled code (also workflows.ts)
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

}
