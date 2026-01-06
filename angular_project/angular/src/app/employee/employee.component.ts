import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../model/employee.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit{

  employee$ : Observable<Employee> = new Observable<Employee>();
  id$ : number | undefined;

  constructor(private http: HttpService, private route: ActivatedRoute){

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employee$ = this.http.getEmployeeExperience(params["id"]);
      this.id$ = params["id"];
    });
    
  }

}
