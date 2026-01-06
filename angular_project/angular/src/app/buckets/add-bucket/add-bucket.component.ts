import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { Bucket } from '../../model/bucket.model';
import { Option } from '../../model/option.model';
import { HttpService } from '../../http.service';
import { AuthService } from '../../auth.service';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from 'src/app/language.service';

@Component({
  selector: 'app-add-bucket',
  templateUrl: './add-bucket.component.html',
  styleUrls: ['./add-bucket.component.scss']
})
export class AddBucketComponent implements OnInit {

  dataSource!: MatTableDataSource<Bucket, MatTableDataSourcePaginator>;
  displayedColumns: string[] = ["bucketname"];
  funcList: Option[] = [{tooltip:"",apiname:"", name: "edit", values: [], multi: true }];
  buckets : Bucket[] = [];
  agentId : number = 0;
  selectedBuckets : Bucket[] = [];
  @Input() data: any;
  selectedLanguage = "english";
  buttonLabel:any
  tooltipLabel:any

  constructor(private http: HttpService, private auth: AuthService, private route: ActivatedRoute,private languageservice:LanguageService){
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

  bucketUsedInAgent(bucket: Bucket){
    if(bucket.agents != undefined){
      for(let agent of bucket.agents){
        if (agent.id == this.agentId) return true;
      }
    } 
    return false;
  }

  loadBuckets(){
    this.http.getAllBuckets(this.auth.me()["user"]["customer"]["id"]).subscribe((rawBuckets : Bucket[]) => {
      console.log("Raw", rawBuckets);
      rawBuckets.forEach(bucket => {
        if(this.bucketUsedInAgent(bucket)) this.selectedBuckets.push(bucket);
        this.buckets.push(new Bucket(bucket.id, bucket.bucketname, bucket.objectkey, bucket.description, bucket.customer));
      });
      this.dataSource = new MatTableDataSource<Bucket>(this.buckets);
    });
  }

  ngOnInit(): void {
    if(this.data != undefined){
      this.agentId = this.data["agentId"];

      this.selectedBuckets = this.data["selectedBuckets"];
      this.loadBuckets();
    }
    else{
      this.route.params.subscribe(params => {
        this.agentId = params["agentId"];
        this.loadBuckets();
        
      });
    }
  }
  
  handleSelectionChange(eventBuckets : Bucket[]){
    this.funcList[0].values[0] = [];
    
    eventBuckets.forEach(eventBucket => {
      this.funcList[0].values[0].push(eventBucket);
    });

    this.funcList[0].values[1]= this.agentId;
    this.funcList[0].values[2]= "buckets";

    console.log("Agent ID in add bucket: ", this.agentId);
  }
}
