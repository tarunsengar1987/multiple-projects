import { MatStepper } from "@angular/material/stepper";
import { HttpService } from "../http.service";

export class Param{
    name: string;
    type: string;
    bodyParam: boolean;
    

    constructor(name: string, type: string, isBodyParam: boolean){
        this.name = name;
        this.type = type;
        this.bodyParam = isBodyParam;
    }
}

export class RestPath{
    path: string;
    params: Param[];

    constructor(path: string, params: Param[]){
        this.path = path;
        this.params = params;
        
    }

    configParams(args: any[], http: HttpService){
        const stepper = args[0] as MatStepper;
        console.log("FIRED", this.path, stepper);
        stepper.selectedIndex = 1;
    }
}

//only used for testing get call, can be removed
export interface RestCall{
    url: string,
    authHeader: string,

}