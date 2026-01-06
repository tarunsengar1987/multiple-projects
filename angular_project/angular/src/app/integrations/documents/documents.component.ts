import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { DynamicFormService } from 'src/app/dynamic-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { Bucket } from 'src/app/model/bucket.model';
import { AppUser } from 'src/app/model/appuser.model';
import { Customer } from 'src/app/model/customer.model';
import { LanguageService } from 'src/app/language.service';
import { SharedEventService } from 'src/app/shared-event.service';

@Component({
  selector: 'app-document',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  formBucket!: FormGroup; 
  labelsBucket!: { [key: string]: string };
  selectedLanguage = "english";
  buckets: Bucket[] = [];
  customers: Customer[] = [];

  constructor(private http: HttpService, private formService: DynamicFormService, private auth: AuthService, private route: ActivatedRoute, private router: Router,private languageservice:LanguageService,private eventservice: SharedEventService){}

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(queryParamMap => {

      this.http.getAllBuckets(this.auth.me()["user"]["customer"]["id"]).subscribe(buckets => {
        this.buckets = buckets;
      });

      this.http.getAllCustomers().subscribe(customers => {
        this.customers = customers;
      });
    });
    this.formBucket = this.formService.createForm(Bucket);
    this.labelsBucket = this.formService.getFormLabels(Bucket, this.selectedLanguage)
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

  showDetails(bucketName : string){
    this.router.navigate(['/bucketdetails/'+bucketName])
  }

}