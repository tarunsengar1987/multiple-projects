import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { Option } from 'src/app/model/option.model';
import { HttpService } from '../http.service';
import { Param, RestPath } from '../model/restpath.model';
import { DynamicFormService } from 'src/app/dynamic-form.service';
import { ActivatedRoute } from '@angular/router';
import { Api, ApiEndpoint } from '../model/api.model';
import { FormControl, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { StateService } from '../state.service';
import { LanguageService } from '../language.service';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent implements OnInit, AfterViewInit{

  dataSource!: MatTableDataSource<RestPath, MatTableDataSourcePaginator>;
  displayedColumns: string[] = ["path"];
  selectedPaths: RestPath[] = [];
  @ViewChild('stepper') private stepper!: MatStepper;
  funcList: Option[] = [{tooltip:"",apiname:"", name: "configParams", values: [] }];
  forms: FormGroup[] = [];
  api!: Api;
  paths: RestPath[] = [];
  endpointCreationSubscription: Subscription = new Subscription();
  chosenApis? : Api[];
  selectedLanguage = "english";
  buttonLabel:any
  tooltipLabel:any
  labels: { [key: string]: string } = {};

  constructor(private http: HttpService, private route : ActivatedRoute, private formService: DynamicFormService, private stateService: StateService,private languageservice:LanguageService){
    this.updateLabel();
  }

  ngAfterViewInit(): void {
    this.funcList[0].values.push(this.stepper);
  }

  updateLabel(){
    this.funcList.forEach(element => {
      this.buttonLabel = this.languageservice.getLabel(this.selectedLanguage, element.name);
      element.apiname = this.buttonLabel;
      this.tooltipLabel = this.languageservice.getTooltip(this.selectedLanguage, element.name);
      element.tooltip = this.tooltipLabel;
    });
  }

  ngOnInit(): void {
    
    
    this.route.params.subscribe(params => {
      this.http.getApi(params["id"]).subscribe(api => {
        this.api = api;
        this.http.getPathsFromOpenApiSpec(api.openapi).subscribe((data: RestPath[]) => {
          data.forEach(path => {
            this.paths.push(new RestPath(path["path"], path["params"]));
          });
          this.dataSource = new MatTableDataSource<RestPath>(this.paths);
        });
      });
    });

    //Todo get exp date
    localStorage.getItem(this.api.authkey);    
  }

  replaceParamPlaceholder(path: string, values: any[]){
    return path.replace(/{(.*?)}/g, (match, group) => {
      // match is the full match, group is the content inside {}
      const replacementKey = group;
      return values[replacementKey] || match; // use replacement if available, otherwise keep the original match
    });
  }

  createPostBody(bodyValues: Map<string, string>){
    let i = 0;
    let temp = "{";

    bodyValues.forEach((value, key) =>{
      temp += "\"" +key + "\": \"" + value + "\"";
      if(i < bodyValues.size-1) temp += ", ";
      i++
    })
    console.log("TEMP is fired", temp);

    return temp +"}";
  }

  onSubmit(form: FormGroup) {
    //muss unterscheidung URL param oder Body param geben
    //nur URL param an url hängen, body mit dem rest bauen
    //muss key / value map sein wobei der key mit dem zu erstezenden bracket inneren {varName} übereinsteimmen muss
    let bodyValues = new Map<string, string>();
    let urlValues = [];
    
    for(let val of this.selectedPaths){
      for(let param of val.params){
        console.log("True? ", param, param.bodyParam);
        if(param.bodyParam) bodyValues.set(param.name, form.value[param.name]);
        else urlValues.push(form.value[param.name]);
      }
      
      const url = this.api.baseurl + this.replaceParamPlaceholder(form.value["doingsPath"], urlValues);
      let endpoint = new ApiEndpoint(url,this.api.id);
      let body = this.createPostBody(bodyValues);
      console.log("Sent POST body", body);

      endpoint.setBody(body);
      const temp : Api[] = this.stateService.getState() as Api[];
      endpoint.name = form.value["name"];
      endpoint.description = form.value["description"];
      endpoint.authHeader = null;
      
      endpoint.api = temp.length > 0 ? temp[temp.length - 1] : temp[0];
      endpoint.apiKey = endpoint.api.authkey;
      

      console.log("Endpoint creation STATE", endpoint);
      
      //can be more then one endpoint that is generated here
      this.http.saveCall(endpoint);
    }

    
  }

  getFormControl(controlKey: string, form: FormGroup): FormControl | null {
    let temp = form.get(controlKey) as FormControl;
    return temp;
  }

  handleSelectionChange(selectedData: RestPath[]): void {
    // Handle the emitted data from the child component
    this.selectedPaths = selectedData;
    console.log('Selected Data:', selectedData);
    this.forms = []; //ToDo can be done more efficient

    let dynamicObject : any = {};

    this.selectedPaths.forEach(sp => {
      const arrayOfNames = sp.params.map(param => param.name);

      dynamicObject = arrayOfNames.reduce((obj, propertyName) => {
        (obj as any)[propertyName] = "{"+propertyName+"}";
        return obj;
      }, {});

      dynamicObject["doingsPath"] = sp.path;
      dynamicObject["name"] = "";
      dynamicObject["description"] = "";

      //for every RestPath a form... (that should be refactored, it is overcomplex)
      this.forms.push(this.formService.createFormGroupFromObject(dynamicObject));
      console.log(this.forms);
      //------------------------ Datafields ----------------------------------------
      
      this.http.getResponseFieldsOfRequest(sp.path, this.api.openapi).subscribe(fields => {
        let allFieldsString = JSON.stringify(fields);
        for(const [key, value] of Object.entries(fields)){
          console.log("FIELDS", key, value);

          //für jedes field einzeln den Path in allFieldsString berechnen (aber vorher im Backend) 
        }
      });

    });
    
  }
}
