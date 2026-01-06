import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-assistants',
  templateUrl: './assistants.component.html',
  styleUrls: ['./assistants.component.scss']
})
export class AssistantsComponent {

  BASE_LINK: string = environment.getBaseLink();

}
