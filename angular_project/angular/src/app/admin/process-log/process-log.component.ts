import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { AutomationAgent } from 'src/app/model/agent.model';

@Component({
  selector: 'app-process-log',
  templateUrl: './process-log.component.html',
  styleUrls: ['./process-log.component.scss']
})
export class ProcessLogComponent implements OnInit {

  searchText = '';
  agents:any
  progress= 50;
  files: string[] = ['file1.txt', 'file2.pdf', 'file3.jpg','file4.pdf', 'file5.jpg'];

  constructor(private http: HttpService){
    this.http.getList<AutomationAgent>('agent').subscribe((agent:any) => {
      this.agents = agent;
      console.log(this.agents)
    })
  }
  ngOnInit(): void {
    this.getbucketList;
  }

  get getbucketList(): string{
    return this.files.join(` | `);
  } 
}
