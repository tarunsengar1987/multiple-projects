import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { GanttItem } from '@worktile/gantt';

export interface GanttList{
  tasks: GanttItem[];
}

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss']
})
export class GanttComponent implements OnInit {

  data!: GanttList;

  /*
  items: GanttItem[] = [
    { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197, expandable: true },
    { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, links: ['000003', '000004', '000000'], expandable: true },
    { id: '000002', title: 'Task 2', start: 1610536397, end: 1610622797 },
    { id: '000003', title: 'Task 3', start: 1628507597, end: 1633345997, expandable: true }
  ];
  */

  constructor(private http : HttpService){

  }

  ngOnInit(): void {

  }

}
