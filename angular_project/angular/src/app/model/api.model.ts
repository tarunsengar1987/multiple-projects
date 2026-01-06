import { Router } from "@angular/router";
import { HttpService } from "../http.service";
import { SharedEventService } from "../shared-event.service";
import { AuthService } from "../auth.service";
import { AutomationAgent } from "./agent.model";

export class Api {

    id: number;
    name: string;
    baseurl: string;
    authurl: string;
    authkey: string;
    scope: string;
    endpoints: ApiEndpoint[];
    openapi: string;

    constructor(id: number, name: string, baseurl: string, authkey: string, scope: string, endpoints: ApiEndpoint[], openapi: string, authurl: string){
        this.id = id;
        this.name = name;
        this.baseurl = baseurl;
        this.authkey = authkey;
        this.scope = scope;
        this.endpoints = endpoints;
        this.openapi = openapi;
        this.authurl = authurl;
    }

    navToIntegrations(args: any[], http: HttpService, multi : boolean = false, eventService : SharedEventService, authService: AuthService){
        //this an shared event service geben (=API)
        console.log("Args", args);
        http.navByUrl("/integrations/" + this.id);
    }

    singleAction(authService: AuthService){
        authService.oAuthInit(this);
    }

    //ToDo HIER WEITER PROBLEM! Endless loop
    singleActionDisabled(authService: AuthService) : boolean{

        /*
        if(authService.jwtTokenIsExpired(this.authkey)){
            console.log("Token expired:", this.authkey);
            return true;
        }

        console.log("Token not expired:", this.authkey);

        return false;
        */
       return true;
    }
}

export class ApiEndpoint {

    id?: number;
    apiurl: string;
    fk_apiid: number;
    authHeader: string | null = "";
    apiKey: string;
    name?: string;
    api?: Api;
    agents?: AutomationAgent[];
    body?: string;
    description? : string;
    istool? : boolean;

    constructor(apiurl: string, apiId: number, apiKey: string = "", id?: number, name?: string, api?: Api, agents: AutomationAgent[] = [], body? : string, description? : string, istool? : boolean){
        if(id) this.id = id;
        if(name != undefined) this.name = name;
        this.apiurl = apiurl;
        this.fk_apiid = apiId;
        this.apiKey = apiKey;
        this.api = api;
        this.agents = agents;
        this.body = body;
        this.description = description;
        this.istool = istool;
    }

    setBody(body: string){
        this.body = body;
    }

    edit(args: any[], http: HttpService, multi : boolean = false, eventService : SharedEventService, authService: AuthService){
        let endpoints : ApiEndpoint[] = args[0];
        let agentId : number = args[1];
        
        http.setEndpointsOfAgent(agentId, endpoints).subscribe(response => {
            
        });
    }
}