import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Employee } from './model/employee.model';
import { RestCall, RestPath } from './model/restpath.model';
import { Api, ApiEndpoint } from './model/api.model';
import { Router } from '@angular/router';
import { AgentList, AutomationAgent, EmbeddingAgents, Workflow, WorkflowsWithContext } from './model/agent.model';
import { AgentPrompt } from './prompt/prompt.component';
import { AgentEvent } from './model/agentevent.model';
import { Bucket } from './model/bucket.model';
import { Customer } from './model/customer.model';
import { T } from '@fullcalendar/core/internal-common';
import { CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private BASE_URL = environment.getApiUrl();
  private PYTHON_URL = environment.getPythonBEUrl();

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }
  //----- FILE UPLOADS -------------------------------------------------------

  uploadFile(files: File[], bucketName: string): Observable<HttpEvent<any>> {
    if (files) {
      const formData = new FormData();
      for (let file of files) {
        formData.append('files', file, file.name);
      }
  
      const headers = new HttpHeaders({
        'Accept': 'application/json'
      })

      return this.http.post<HttpEvent<any>>(this.BASE_URL + "/bucket/upload/" + bucketName, formData, {
        headers: headers,
        reportProgress: true,
        observe: 'events'
      });
    } else {
      console.error('No file selected');
      // Return an empty observable or throw an error to match the method's return type
      return new Observable<HttpEvent<any>>();
    }
  }

  //----- prepare auth headers object ----------------------------------------

  //todo must be generic NO hardcoded token here
  getAllAuthHeaders(){
    const authHeaders = this.cookieService.get('authHeaders');

    console.log("Auth headers for agent", authHeaders);

    const result = JSON.parse(authHeaders || "{}");

    console.log("Parsed JSON", result);

    return result;
  }

  setEndpointAuthHeader(ep: ApiEndpoint){
    
    const storedAuth = localStorage.getItem(ep.apiKey);
    if(storedAuth != null) {
      const objectAuth = JSON.parse(storedAuth)
      ep.authHeader = objectAuth["access_token"];
    }
  }
  //----- Customer management ------------------------------------------------

  getAllCustomers() : Observable<Customer[]>{
    return this.http.get<Customer[]>(this.BASE_URL + "/customer/list");
  }

  //----- Bucket management --------------------------------------------------
  getAllBuckets(customerId : number) : Observable<Bucket[]>{
    return this.http.get<Bucket[]>(this.BASE_URL + "/bucket/list/"+customerId);
  }

  getBucket(bucketName : string){
    return this.http.get<Bucket>(this.BASE_URL + "/bucket/"+bucketName);
  }

  saveBucketsForAgent(agentId: number, buckets: Bucket[]){
    const body = {
      buckets: buckets,
      agentId: agentId
    }
    let header = new HttpHeaders();
    return this.http.post(this.BASE_URL + "/bucket/setAgent", body, {headers:header});
  }

  getAllFilesInBucket(bucketName: string) : Observable<string[]>{
    return this.http.get<string[]>(this.BASE_URL + "/bucket/files/"+bucketName);
  }

  deleteFileFromBucket(bucketName: string, objectKey: string){
    return this.http.delete(this.BASE_URL + "/bucket/"+bucketName+"/"+objectKey);
  }

  //----- REST connector & APIs ----------------------------------------------
  getPathsFromOpenApiSpec(url: string) : Observable<RestPath[]>{
    url = encodeURIComponent(url);
    console.log(this.BASE_URL + "/call/paths?openApiUrl=" + url);
    return this.http.get<RestPath[]>(this.BASE_URL + "/call/paths?openApiUrl=" + url);
  }

  getResponseFieldsOfRequest(path: string, openApiUrl: string) : Observable<string[]>{
    path = encodeURIComponent(path);
    openApiUrl = encodeURIComponent(openApiUrl);
    return this.http.get<string[]>(this.BASE_URL + "/call/schemas?path=" + path + "&openApiUrl=" + openApiUrl);
  }

  createApiIntegration(api : Api){
    const body = api;
    const header = new HttpHeaders();
    return this.http.put(this.BASE_URL + "/call/putApi", body, {headers:header});
  }

  deleteApiIntegration(id : number){
    return this.http.delete(this.BASE_URL + "/call/deleteApi/" + id);
  }

  getApiIntegrations() : Observable<Api[]>{
    return this.http.get<Api[]>(this.BASE_URL + "/call/getApi");
  }

  getAllApiEndpoints() : Observable<ApiEndpoint[]>{
    return this.http.get<ApiEndpoint[]>(this.BASE_URL + "/call/getApiEndpoints");
  }

  createApiEndpoint(apiEndpoint : ApiEndpoint){
    const body = apiEndpoint;
    const header = new HttpHeaders();
    return this.http.put(this.BASE_URL + "/call/putApiEndpoint", body, {headers:header});
  }

  deleteApiendpoint(id : number){
    return this.http.delete(this.BASE_URL + "/call/deleteApiEndpoint/" + id);
  }

  getApi(id: number) : Observable<Api>{
    return this.http.get<Api>(this.BASE_URL + "/call/getApi/" + id);
  }

  saveCall(endpoint: ApiEndpoint){
    let header = new HttpHeaders();
    return this.http.put(this.BASE_URL + "/call/putApiEndpoint/" + endpoint.fk_apiid, endpoint, {headers:header}).subscribe(data => {

    });
  }
  
  //----- LlamaIndex Agents ---------------------------------------------------
  promptAgent(inputs: string, previous_context: string, promptId: string, agent?:AutomationAgent) : Observable<AgentPrompt>{
    console.log("Agent full_prompt", previous_context + " " + inputs);
    let header = new HttpHeaders().set('Content-Type', 'application/json');
    //let body = { prompt: previous_context + " " + inputs, agents: [agent], promptId: promptId, authHeaders: this.getAllAuthHeaders() };
    let body = { prompt: inputs, agents: [agent], promptId: promptId, authHeaders: this.getAllAuthHeaders() };

    if(agent != undefined){
      console.log("Body of fired agent", body);
      return this.http.post<AgentPrompt>(this.BASE_URL + "/agent/promptWithContext", body, {headers:header})
    }
    else return this.http.post<AgentPrompt>(this.BASE_URL + "/agent/prompt", body, {headers:header});
  }

  getAgentEvents(promptId: string){
    return this.http.get<AgentEvent[]>(this.BASE_URL + "/agent/getEvents/" + promptId);
  }

  //for human in the loop interception
  sendHumanFeedback(promptId: string, body: string){
    let header = new HttpHeaders();
    console.log("Sending feedback", this.BASE_URL + "/agent/humanFeedback/"+promptId, body);
    return this.http.post(this.BASE_URL + "/agent/humanFeedback/"+promptId, body, {headers:header})
  }

  //----- Automation Agents ---------------------------------------------------
  getAllAgents() : Observable<AutomationAgent[]>{
    let obs =  this.http.get<AutomationAgent[]>(this.BASE_URL + "/agent/list");
    obs.subscribe(data => {
      console.log("DATA1", data);
    });
    return obs;
  }

  editPrompt(agentId: number, prompt: string){
    let header = new HttpHeaders();
    return this.http.put(this.BASE_URL + "/agent/editPrompt/"+agentId, prompt, {headers:header});
  }

  editContext(agentId: number, context: string){
    let header = new HttpHeaders();
    return this.http.put(this.BASE_URL + "/agent/editContext/"+agentId, context, {headers:header});
  }

  getAgent(id: number) : Observable<AutomationAgent>{
    return this.http.get<AutomationAgent>(this.BASE_URL + "/agent/"+id);
  }

  //ToDo remove?
  executeCalls(agentList : AgentList) {
    // /pages only doesnt work, but this works: BASE_URL/wiki/api/v2/pages
    let header = new HttpHeaders();
    return this.http.post(this.BASE_URL + "/agent/execute", agentList, {headers:header}).subscribe(data => {
      console.log("Agents executed", data);
    });
  }

  /* Maybe deprectaed? => If so remove
  execute(body: any) : Observable<any>{
    console.log("Body", body);
    let header = new HttpHeaders();
    return this.http.post(this.BASE_URL + "/agent/execute", body, {headers:header});
  }
  */

  //aka workflow
  saveFlow(workflow: Workflow){
    let header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    console.log("WF", workflow);
    this.http.post(this.BASE_URL + "/agent/saveFlow", workflow, {headers:header}).subscribe(data => {
      console.log(data)
    });
  }

  getAllWorkflows() : Observable<Workflow[]>{
    return this.http.get<Workflow[]>(this.BASE_URL + "/agent/getFlows");
  }

  executeFlows(wfs : WorkflowsWithContext) {
    console
    const authHeaders = this.getAllAuthHeaders();
    wfs.authHeaders = authHeaders;
    let header = new HttpHeaders();
    this.http.post(this.BASE_URL + "/agent/executeFlows", wfs, {headers:header}).subscribe(refreshedAuthHeaders => {
      //save the refreshed auth headers in the local storage
      for(const [key, value] of Object.entries(refreshedAuthHeaders)){
        localStorage.setItem(key, value);
      }
    });
  }

  executeJson(body: any) : Observable<any>{
    let header = new HttpHeaders();
    return this.http.post(this.BASE_URL + "/agent/executeJson", body, {headers:header});
  }

  //deprecated?
  matchAgents(body: string[]) : Observable<AutomationAgent[]>{
    let header = new HttpHeaders();
    return this.http.post<AutomationAgent[]>(this.BASE_URL + "/orchestrate/matchAgent", body, {headers:header});
  }

  setEndpointsOfAgent(agentId: number, endpoints: ApiEndpoint[]){
    let header = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(this.BASE_URL + "/agent/setEndpointsForAgent/" + agentId, endpoints, {headers:header});
  }

  setBucketsOfAgent(agentId: number, buckets: Bucket[]){
    let header = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(this.BASE_URL + "/agent/setBucketsForAgent/" + agentId, buckets, {headers:header});
  }

  //----- Embeddings ----------------------------------------------------------

  matchAgentsToPrompt(body: string) : Observable<EmbeddingAgents>{
    let header = new HttpHeaders();
    return this.http.post<EmbeddingAgents>(this.PYTHON_URL + "/retrieve/agents", body, {headers:header});
  }

  //----- OpenID --------------------------------------------------------------
  getOpenIDPrincipal(){
    return this.http.get(this.BASE_URL + '/oid/principal');
  }
  //----- sagemaker -----------------------------------------------------------

  createSagemakerEndpoint(configName: string){
    console.log("URL called", this.BASE_URL + '/endpoint/create/' + configName);
    return this.http.get(this.BASE_URL + '/endpoint/create/' + configName);
  }

  //----- RAG -----------------------------------------------------------------

  uploadRagFiles(){
    return this.http.get(this.BASE_URL + '/endpoint/create/');
  }

  //----- deprecated calls ----------------------------------------------------
  getEmployeeExperience(id : number) : Observable<Employee>{
    return this.http.get<Employee>(this.BASE_URL + '/employee/' + id);
  }

  postPrompt(endpointName: string, body: { inputs: string; parameters: object }) : Observable<string[]>{
    return this.http.post<string[]>(this.BASE_URL + '/orchestrate/getWorkflow/' + endpointName, body);
  }

  postPromptJson(endpointName: string, body: { inputs: string; parameters: object }) : Observable<string[]>{
    return this.http.post<string[]>(this.BASE_URL + '/orchestrate/getWorkflow/' + endpointName + '/json', body);
  }
  //----- end deprecated calls ------------------------------------------------

  healthCheck() {
    return this.http.get(this.BASE_URL + '/me/health', { responseType: 'text' });
  }

  delete(entityName: string, id: (number|string)){
    return this.http.delete(this.BASE_URL + '/' + entityName + '/delete/' + id);
  }

  createUser<T>(body:T){
    return this.http.post(this.BASE_URL + '/user/add', body ).subscribe(data =>{
      console.log(data);
    });
  }

  userStatus(user:T,status:boolean){
    console.log(user)
    this.http.post(this.BASE_URL + `/user/setUserStatus/id`, status).subscribe(
        (response:any) => {
          status = !status;
          console.log('User status updated:', response);
        },
        (error:any) => {
          console.error('Error updating user status:', error);
        }
      );
  }

  put<T>(entityName: string, body: T){
    const header = {}
    console.log("PUT", body);
    return this.http.put<T>(this.BASE_URL + '/' + entityName + '/create', body, {headers:header});
  }

  getList<T>(entityName: string) : Observable<T[]>{
    return this.http.get<T[]>(this.BASE_URL + '/' + entityName + '/list');
  }

  getSingle<T>(entityName: string, id: (number|string)) : Observable<T>{
    console.log(this.BASE_URL + '/' + entityName + '/' + id);
    return this.http.get<T>(this.BASE_URL + '/' + entityName + '/' + id);
  }

  //-------------------- internal navigation ------------------------------------
  navByUrl(url: string){
    this.router.navigateByUrl(url);
  }

  //-------------------- user ---------------------------------------------------
  
  //--------------------- Tests ----------------------------------

  accessPythonBackendTest(){
    console.log("python access test started...");
    this.http.get(this.PYTHON_URL + "/testcon").subscribe(resp => {
      console.log("Response 1: " + resp);
    });
  }
}


