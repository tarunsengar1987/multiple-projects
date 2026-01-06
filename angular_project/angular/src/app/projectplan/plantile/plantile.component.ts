import { Component, Input, OnInit } from '@angular/core';
import { Task, Tasklist } from 'src/app/promptui/milestone/milestone.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-plantile',
  templateUrl: './plantile.component.html',
  styleUrls: ['./plantile.component.scss']
})
export class PlantileComponent implements OnInit{
  ngOnInit(): void {
    this.getSubtasks();
  }

  @Input() task!: Task;
  @Input() tasklist!: Tasklist;
  subtasks : Task[] = []
  @Input() taskColor: string | undefined;

  getSubtasks() {
    for(let subTaskId of this.task.subtask_ids){
      console.log("Subtask ID: ", subTaskId, this.task.subtask_ids);
      let temp = this.tasklist.tasks.find(task => subTaskId === task.id);
      if(temp != undefined) this.subtasks.push(temp);
    }
    console.log("Subtasks", this.subtasks);
  }

}
