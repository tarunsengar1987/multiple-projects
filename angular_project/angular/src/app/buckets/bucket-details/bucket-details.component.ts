import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../http.service';
import { AutomationAgent } from '../../model/agent.model';
import { Bucket } from '../../model/bucket.model';

@Component({
  selector: 'app-bucket-details',
  templateUrl: './bucket-details.component.html',
  styleUrls: ['./bucket-details.component.scss']
})
export class BucketDetailsComponent implements OnInit {

  bucketName? : string;
  @Input() data? : any; 
  fileNamesInBucket : string[] = [];
  agents : AutomationAgent[] = [];
  bucket? : Bucket;

  constructor(private route: ActivatedRoute, private http: HttpService){

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bucketName = params["bucketName"];

      //maybe the input is set alternatively?
      if(this.bucketName == undefined) this.bucketName = this.data.bucketName;

      //param or input should be set?
      if(this.bucketName != undefined){
        this.http.getBucket(this.bucketName).subscribe(bucket => {
          this.bucket = bucket;
          if(bucket.agents != undefined)
            this.agents = bucket.agents; //TODO changed agents in buckets to JSONIGNORE in Backend, need a plan here
        });
        this.http.getAllFilesInBucket(this.bucketName).subscribe(fileList => {
          this.fileNamesInBucket = fileList;
        });
      }
        
    });
  }

  deleteFile(fileName: string){

    if(this.bucketName != undefined){
      this.http.deleteFileFromBucket(this.bucketName, fileName).subscribe();
    }

  }

}
