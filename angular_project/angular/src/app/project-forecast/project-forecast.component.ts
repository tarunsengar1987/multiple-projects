import { Component } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-project-forecast',
  templateUrl: './project-forecast.component.html',
  styleUrls: ['./project-forecast.component.scss']
})
export class ProjectForecastComponent {

  constructor(private http: HttpService){

  }

}
