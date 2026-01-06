import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { HttpService } from 'src/app/http.service';
import { SagemakerConfig, SagemakerConfigContainer } from 'src/app/model/sagemaker.config.model';
import { Option } from 'src/app/model/option.model';
import { SagemakerEndpoint } from 'src/app/model/sagemaker.endpoint.model';
import { Subscription } from 'rxjs';
import { SharedEventService } from 'src/app/shared-event.service';
import { LanguageService } from 'src/app/language.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dataSource!: MatTableDataSource<SagemakerConfig, MatTableDataSourcePaginator>;
  displayedColumns: string[] = ["endpointConfigName", "creationTime"];
  funcListSageConfig: Option[] = [{tooltip:"",apiname:"", name: "deleteEndpointConfig", values: [] }, {tooltip:"",apiname:"", name: "createEndpoint", values: [] }];

  dataSourceEP!: MatTableDataSource<SagemakerEndpoint, MatTableDataSourcePaginator>;
  displayedColumnsEP: string[] = ["endpointName", "endpointStatus", "creationTime"];
  funcListEP: Option[] = [{tooltip:"",apiname:"", name: "deleteEndpoint", values: [] }];
  subscription: Subscription = new Subscription();
  selectedLanguage = "english";
  buttonLabel:any
  tooltipLabel:any


  constructor(private http: HttpService, private eventService : SharedEventService, private cdr: ChangeDetectorRef,private languageservice:LanguageService) {
    this.subscription = this.eventService.tableManagerSubject$.subscribe( data => {
      this.loadData();
    });
    this.updateLabel();
  }

  updateLabel(){
    this.funcListSageConfig.forEach(element => {
      this.buttonLabel = this.languageservice.getLabel(this.selectedLanguage, element.name);
      element.apiname = this.buttonLabel;
      this.tooltipLabel = this.languageservice.getTooltip(this.selectedLanguage, element.name);
      element.tooltip = this.tooltipLabel;
    });
    this.funcListEP.forEach(element => {
      this.buttonLabel = this.languageservice.getLabel(this.selectedLanguage, element.name);
      element.apiname = this.buttonLabel;
      this.tooltipLabel = this.languageservice.getTooltip(this.selectedLanguage, element.name);
      element.tooltip = this.tooltipLabel;
    });
  }

  loadData(){
    console.log("DATA RELOADED");
    //-------- config -----------------------
    let classData: SagemakerConfig[] = [];
    this.http.getList<SagemakerConfig>("sagemaker/endpoint/config").subscribe((data: SagemakerConfig[]) => {
      data.forEach(d => {
        classData.push(new SagemakerConfig(d.endpointConfigName, d.endpointConfigArn, d.creationTime));
      });
      this.dataSource = new MatTableDataSource<SagemakerConfig>(classData); 
    });
    //-------- endpoint ---------------------
    let classDataEP: SagemakerEndpoint[] = [];
    this.http.getList<SagemakerEndpoint>("sagemaker/endpoint").subscribe((data: SagemakerEndpoint[]) => {
      data.forEach(ep => {
        classDataEP.push(new SagemakerEndpoint(ep.endpointName, ep.endpointArn, ep.creationTime, ep.lastModifiedTime, ep.endpointStatus));
      });
      this.dataSourceEP = new MatTableDataSource<SagemakerEndpoint>(classDataEP); 
    });

    this.cdr.detectChanges();
    window.location.reload(); //TODO get change detection to work
  }

  ngOnInit(): void {
    this.loadData();

  }

}
