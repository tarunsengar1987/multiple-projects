import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ApiEndpoint } from 'src/app/model/api.model';
import { Option } from '../../model/option.model';
import { HttpService } from 'src/app/http.service';
import { LanguageService } from 'src/app/language.service';

@Component({
  selector: 'app-add-endpoints',
  templateUrl: './add-endpoints.component.html',
  styleUrls: ['./add-endpoints.component.scss']
})
export class AddEndpointsComponent implements OnInit {

  dataSource!: MatTableDataSource<ApiEndpoint, MatTableDataSourcePaginator>;
  displayedColumns: string[] = ["name"];
  funcList: Option[] = [{tooltip:"",apiname:"",name: "edit", values: [], multi: true }];
  @Input() data: any;
  endpoints: ApiEndpoint[] = [];
  selectedEndpoints: ApiEndpoint[] = []
  selectedLanguage = "english";
  buttonLabel:any
  tooltipLabel:any

  constructor(private http: HttpService,private languageservice:LanguageService){
    this.updateLabel();
  }

  updateLabel(){
    this.funcList.forEach(element => {
      this.buttonLabel = this.languageservice.getLabel(this.selectedLanguage, element.name);
      element.apiname = this.buttonLabel;
      this.tooltipLabel = this.languageservice.getTooltip(this.selectedLanguage, element.name);
      element.tooltip = this.tooltipLabel;
    });
  }

  loadEndpoints(){
    this.http.getAllApiEndpoints().subscribe(rawEndpoints => {
      for(let rawEndpoint of rawEndpoints){
        if(rawEndpoint.api != undefined){
          let endpoint = new ApiEndpoint(rawEndpoint.apiurl, rawEndpoint.api.id, rawEndpoint.apiKey, rawEndpoint.id, rawEndpoint.name, rawEndpoint.api, rawEndpoint.agents, rawEndpoint.body, rawEndpoint.description);
          this.endpoints.push(endpoint);
        }else{
          let endpoint = new ApiEndpoint(rawEndpoint.apiurl, 0, rawEndpoint.apiKey, rawEndpoint.id, rawEndpoint.name, rawEndpoint.api, rawEndpoint.agents, rawEndpoint.body, rawEndpoint.description);
          this.endpoints.push(endpoint);
        }
      }
      console.log("Processed Endpoints ", this.endpoints);
      this.dataSource = new MatTableDataSource<ApiEndpoint>(this.endpoints);
    });
  }

  ngOnInit(): void {
    this.selectedEndpoints = this.data["selectedAPIs"];
    this.loadEndpoints();
  }

  handleSelectionChange(eventEndpoints : ApiEndpoint[]){
    this.funcList[0].values[0] = [];

    console.log("Selection change", eventEndpoints);
    
    eventEndpoints.forEach(eventEndpoint => {
      eventEndpoint.authHeader = this.http.getAllAuthHeaders();
      this.funcList[0].values[0].push(eventEndpoint);
    });
    this.funcList[0].values[1]= this.data["agentId"];
  }

}
