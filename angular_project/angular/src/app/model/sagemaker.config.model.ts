import { HttpService } from "../http.service";

export class SagemakerConfig{
    endpointConfigName: string;
    endpointConfigArn: string;
    creationTime: string;

    constructor(endpointConfigName: string, endpointConfigArn: string, creationTime: string){
        this.endpointConfigName = endpointConfigName;
        this.endpointConfigArn = endpointConfigArn;
        this.creationTime = creationTime;
    }

    text(args: any[], http: HttpService){
        console.log("Sagemaker!", this, args);
        http.healthCheck().subscribe( res => {
            console.log("RES", res);
        });
    }
    
    deleteEndpointConfig(args: any[], http: HttpService){
        console.log("Config deleted", this.endpointConfigName);
        http.delete("sagemaker/config",this.endpointConfigName).subscribe();
    }

    //Creates an AWS Sagemaker Inference Endpoint
    createEndpoint(args: any[], http: HttpService){
        http.getSingle("sagemaker/endpoint/create",this.endpointConfigName).subscribe();
    }
}

export interface SagemakerConfigContainer{
    endpointConfigs: SagemakerConfig[]
}