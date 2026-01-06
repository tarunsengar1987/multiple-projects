import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { DynamicFormService } from 'src/app/dynamic-form.service';
import { HttpService } from 'src/app/http.service';
import { Api } from 'src/app/model/api.model';
import { AppUser } from 'src/app/model/appuser.model';
import { Bucket } from 'src/app/model/bucket.model';
import { Customer } from 'src/app/model/customer.model';
import { Option } from 'src/app/model/option.model';
import { StateService } from 'src/app/state.service';
import { SharedEventService } from 'src/app/shared-event.service';
import { LanguageService } from 'src/app/language.service';

@Component({
  selector: 'app-apis',
  templateUrl: './apis.component.html',
  styleUrls: ['./apis.component.scss']
})
export class ApisComponent implements OnInit {
  dataSource!: MatTableDataSource<Api, MatTableDataSourcePaginator>;
  displayedColumns: string[] = ["name", "baseurl","openapi"];
  form!: FormGroup;
  formBucket!: FormGroup; 
  funcListSageConfig: Option[] = [{tooltip:"",apiname:"", name: "navToIntegrations", values: [] },{tooltip:"",apiname:"", name: "deleteApi", values: [] }];
  singleAction!: Option[];
  buckets: Bucket[] = [];
  customers: Customer[] = [];
  selectedLanguage = "english";
  buttonLabel:any
  tooltipLabel:any
  labelsApi!: { [key: string]: string };
  labelsBucket!: { [key: string]: string };

  constructor(private http: HttpService, private formService: DynamicFormService, private auth: AuthService, private route: ActivatedRoute, private router: Router, private stateService: StateService,private languageservice:LanguageService,private eventservice:SharedEventService)
    {
    this.updateLabel();
  }

  onSubmit() {
    const api = this.form.value as Api;
    this.http.put("call/api",api).subscribe(data => {
      console.log("Saved", api);
      this.eventservice.openSnackBar('API Added Successfully', 'Close')
    });
  }

  updateLabel(){
    this.funcListSageConfig.forEach(element => {
      this.buttonLabel = this.languageservice.getLabel(this.selectedLanguage, element.name);
      element.apiname = this.buttonLabel;
      this.tooltipLabel = this.languageservice.getTooltip(this.selectedLanguage, element.name);
      element.tooltip = this.tooltipLabel;
    });
  }

  showDetails(bucketName : string){
    this.router.navigate(['/bucketdetails/'+bucketName])
  }

  onSubmitBucket(){
    const bucket = this.formBucket.value as Bucket;
    const user = this.auth.me()["user"] as AppUser;

    bucket.customer = user.customer;
    bucket.objectkey = ""; //was agent_data
    this.http.put("bucket", bucket).subscribe(response => {
      console.log("Bucket saved", response);
      this.eventservice.openSnackBar('Bucket saved successfully', 'Close')
    });
  }


  handleSelectionChange(event : any){
    console.log("API-Component", event);
    this.stateService.setState(event);
  }
  
  ngOnInit(): void {

    //query params
    this.route.queryParamMap.subscribe(queryParamMap => {

      this.http.getAllBuckets(this.auth.me()["user"]["customer"]["id"]).subscribe(buckets => {
        this.buckets = buckets;
      });

      this.http.getAllCustomers().subscribe(customers => {
        this.customers = customers;
      });

      //OAUTH code handling
      //route params
      this.route.paramMap.subscribe(routeParamMap => {
        console.log("Params: ", routeParamMap, queryParamMap);
        //Authorization token is handled
        if(queryParamMap.has("code")) {
          const code = queryParamMap.get("code");
          if(code !== null && code !== undefined){
            if(routeParamMap.has("apiName")) { //this is for the google login in the login component!
              console.log("API", routeParamMap.get("apiName"));
              const apiName = routeParamMap.get("apiName") as string;
              this.auth.getAccessTokenFromAuthCode(code, apiName);
            }
            else {
              console.log("Atlassian", code);
              this.auth.getAccessTokenFromAuthCode(code, "atlassian");
            }
          }
        } //TODO handle null && undefined //(code !== null && code !== undefined)
      });
    });

    this.form = this.formService.createForm(Api);
    this.formBucket = this.formService.createForm(Bucket);
    this.labelsApi = this.formService.getFormLabels(Api, this.selectedLanguage)
    this.labelsBucket = this.formService.getFormLabels(Bucket, this.selectedLanguage)

    this.http.getApiIntegrations().subscribe((data : Api[]) => {
      let allApis : Api[] = [];
      data.forEach(api => {
        //necessary because generic "fireFunctionByParameter()" needs this to be a real class object 
        allApis.push(new Api(api.id, api.name, api.baseurl, api.authkey,api.scope,api.endpoints, api.openapi, api.authurl));
      });
      this.dataSource = new MatTableDataSource<Api>(allApis);
    });
  }

}
