import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/parts/dialog/dialog.component';
import { CreateMilestoneComponent } from './create-milestone/create-milestone.component';

export interface Task{
  id: string,
  title: string,
  description: string,
  subtask_ids: string[]
}

export interface Tasklist {
  tasks: Task[];
}

@Component({
  selector: 'app-milestone',
  templateUrl: './milestone.component.html',
  styleUrls: ['./milestone.component.scss']
})
export class MilestoneComponent implements OnInit {

  constructor(private dialog: MatDialog){}

  data! : Tasklist;

  colors: string[] = ['#7FFFD4', '#F05A7E', '#FFDC7F', '#9DBDFF', '#FF9874', '#EBD3F8', '#A7E6FF'];

  ngOnInit(): void {
      


  }
  getColor(taskIndex: number): string {
    return this.colors[taskIndex % this.colors.length];
}

  isSubtask(task: Task){
    let temp = this.data.tasks.find( tsk => tsk.subtask_ids.indexOf(task.id)>=0);
    return (temp!=undefined);
  }

  createMilestone(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "Create New Milestone",
        component: CreateMilestoneComponent,
        componentData: {
          data : {

          }
        }
      }    
    });
  }

}
