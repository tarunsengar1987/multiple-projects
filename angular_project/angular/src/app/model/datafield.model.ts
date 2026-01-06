export class Datafield{
    id: number;
    agentid: number;
    endpointid: number;
    path: String;
    keepprops: String;
    fieldname: String;

    constructor(id: number, agentid: number, endpointid: number, path: String, keepprops: String, fieldname: String){
        this.id = id;
        this.agentid = agentid;
        this.endpointid = endpointid;
        this.path = path;
        this.keepprops = keepprops;
        this.fieldname = fieldname;
    }

}