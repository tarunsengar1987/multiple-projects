import { HttpService } from "../http.service";

export class SagemakerEndpoint{
    endpointName: string;
    endpointArn: string;
    creationTime: string;
    lastModifiedTime: string;
    endpointStatus: string;

    constructor(endpointName: string, endpointArn: string, creationTime: string, lastModifiedTime: string, endpointStatus: string){
        this.endpointName = endpointName;
        this.endpointArn = endpointArn;
        this.creationTime = creationTime;
        this.lastModifiedTime = lastModifiedTime;
        this.endpointStatus = endpointStatus;
    }
    
    edit(): void {
        throw new Error("Method not implemented.");
    }

    deleteEndpoint(args: any[], http: HttpService){
        http.delete("sagemaker/endpoint",this.endpointName).subscribe();
    }
}