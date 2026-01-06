import { Component } from '@angular/core';

export interface Check{
  question: string,
  answer: string
}

export interface Checklist{
  checklist: Check[]
}

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent {
  data! : Checklist;
}
