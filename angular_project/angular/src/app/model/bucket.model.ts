import { AuthService } from "../auth.service";
import { HttpService } from "../http.service";
import { SharedEventService } from "../shared-event.service";
import { AutomationAgent, Workflow, WorkflowsWithContext } from "./agent.model";
import { Customer } from "./customer.model";

export class Bucket{
    id: number;
    bucketname: string;
    objectkey: string;
    customer: Customer;
    description: string;
    agents?: AutomationAgent[]

    constructor(id: number, bucketname: string, objectkey: string, description: string, customer: Customer, agents?: AutomationAgent[]){
        this.id = id;
        this.bucketname = bucketname;
        this.objectkey = objectkey;
        this.customer = customer;
        this.description = description;
        if(agents !== undefined && agents !== null){
            this.agents = agents;
        }
    }

    edit(args: any[], http: HttpService, multi : boolean = false, eventService : SharedEventService, authService: AuthService){
        let buckets : Bucket[] = args[0];
        let agentId : number = args[1];
        
        http.setBucketsOfAgent(agentId, buckets).subscribe(response => {
            
        });
    }
}