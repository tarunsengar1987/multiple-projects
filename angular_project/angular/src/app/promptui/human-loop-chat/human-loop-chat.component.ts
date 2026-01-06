import { Component } from '@angular/core';
import { SharedEventService } from 'src/app/shared-event.service';

@Component({
  selector: 'app-human-loop-chat',
  templateUrl: './human-loop-chat.component.html',
  styleUrls: ['./human-loop-chat.component.scss']
})
export class HumanLoopChatComponent {

  constructor(private eventService: SharedEventService){

  }

  inputs = ""
  question = ""

  submitForm(){
    this.eventService.humanLoopAnswer(this.inputs);
  }
}
