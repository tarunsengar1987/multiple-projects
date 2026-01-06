import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Displayable } from 'src/app/model/displayable.model';

@Component({
  selector: 'app-draglist',
  templateUrl: './draglist.component.html',
  styleUrls: ['./draglist.component.scss']
})
export class DraglistComponent {

  @Input() items: Displayable[] = [];

  @Output() cdkDropListDropped: EventEmitter<any> = new EventEmitter<any>();

  drop(event: CdkDragDrop<Displayable[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.cdkDropListDropped.emit(event);
  }
}
