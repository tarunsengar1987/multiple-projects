import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { HttpService } from "../http.service";
import { SharedEventService } from "../shared-event.service";
import { ApiEndpoint } from "./api.model";
import { Displayable } from "./displayable.model";
import { Bucket } from "./bucket.model";
import { StateService } from "../state.service";

export enum AgentType{
    PROMPT,
    SKILLEXTRACT,
    TEXTTOSPEECH
}

export class AutomationAgent implements Displayable{
    id: number;
    name: string;
    ai_endpoint: string;
    prompt : string;
    api_endpoints : ApiEndpoint[];
    buckets : Bucket[];
    bucketsAsString? : string;
    agentType: AgentType = AgentType.PROMPT;
    skills: string;
    context: string;
    parameters: string;
    body: string;
    inputs: string

    constructor(id: number,
        name: string,
        ai_endpoint: string,
        prompt : string,
        api_endpoints : ApiEndpoint[],
        agentType: AgentType,
        skills: string,
        context: string,
        parameters: string,
        body: string,
        buckets: Bucket[],
        inputs: string){
            this.id = id;
            this.name = name;
            this.ai_endpoint = ai_endpoint;
            this.prompt = prompt;
            this.api_endpoints = api_endpoints;
            this.agentType = agentType;
            this.skills = skills;
            this.context = context;
            this.parameters = parameters;
            this.body = body;
            this.buckets = buckets;
            this.inputs = inputs;
    }
    getName(): string {
        return this.name;
    }

    //Deprecated + if used further => refactor!
    //HIER WEITER HIER MÜSSTE EIGENTLICH Auth Service RefreshToken rein!!! ABER => Gibts nen besseren Weg/Stelle? 
    populateAuthHeaders(agent : AutomationAgent, authService: AuthService){
        //it's not "this" agent, its an agent from the selection
        agent.api_endpoints.forEach(async endpoint => {
            const token = localStorage.getItem(endpoint.apiKey);
            let isExpired;
            if(token != null) isExpired = authService.jwtTokenIsExpired(token, endpoint.apiKey);
            console.log("is Google expired?", isExpired);
            if(!token || isExpired){
                const userId = authService.me().user.id;
                console.log("Trying to refresh token for: ", endpoint.apiKey, userId);
                authService.useRefreshToken(endpoint.apiKey,userId).subscribe((newJwtToken : any) => {
                    endpoint.authHeader = newJwtToken["access_token"];
                    localStorage.setItem(endpoint.apiKey, newJwtToken["access_token"]);
                    console.log("Token was EXPIRED and was refreshed, auth header populated", endpoint.apiKey, (newJwtToken["access_token"] != null));
                });
            }else {
                endpoint.authHeader = token;
                console.log("Token was not expired, auth header poulated", endpoint.apiKey);
            }
            
        });
    }

    //todo does not work
    execute(args: any[], http: HttpService, multi : boolean = false, eventService : SharedEventService, authService: AuthService){
        
        console.log("Args: ", args);
        const router : Router = args[0];
        const agent : AutomationAgent = args[1];

        router.navigate(['/prompt/'+this.id], { state: { agent: agent } });

    }

    saveFlow(args: any[], http: HttpService, multi : boolean = false, eventService : SharedEventService, authService: AuthService){
        const workflow : Workflow = new Workflow(args[1], args[0]);
        console.log("REAL FLOW", workflow)
        http.saveFlow(workflow);
    }

    singleAction(authService: AuthService){
        window.location.href = '/addbuckets/'+this.id;
    }
  
    //ToDo HIER WEITER PROBLEM! Endless loop
    singleActionDisabled(authService: AuthService) : boolean{
  
      return true;
    }
}

export interface AgentList{
    agentIds : number[], //List of Agent ids
    inputs : object,
    agents : AutomationAgent[]
}

//a from the agentchooser.ts matched agent 
export interface EmbeddingAgents{
    data: string[],
    distances: string[],
    documents: string[][],
    embeddings: [],
    ids: string[],
    metadatas: [],
    uris: string
}

export class WorkflowsWithContext{
    workflows: Workflow[];
    promptId: string;
    authHeaders?: any;

    constructor(workflows: Workflow[], promptId: string){
        this.workflows = workflows;
        this.promptId = promptId;
    }
}

export class Workflow{
    id?: number;
    name: string;
    agents: AutomationAgent[];
    description?: string;

    constructor(name: string, agents: AutomationAgent[], description?: string,id?:number){
        this.name = name;
        this.agents = agents;
        if(id !== undefined && id !== null){
            this.id = id;
        }
        if(description !== undefined && description !== null){
            this.description = description;
        }
    }

    run(promptId: string, stateService: StateService, router: Router){
        const wfsWithContext : WorkflowsWithContext = {
            workflows: [this],
            promptId: promptId
        }

        stateService.setState(wfsWithContext);
        router.navigate(["/prompt"]);
    }

    execute(args: any[], http: HttpService, multi : boolean = false, eventService : SharedEventService, authService: AuthService){
        let workflow : Workflow[] = args[0];
        const wfsWithContext : WorkflowsWithContext = {
            workflows: args[0],
            promptId: args[1]
        }
        eventService.workflowReady(wfsWithContext);
        //console.log("inner", workflow);
        //http.executeFlows(wfsWithContext);
    }
}
