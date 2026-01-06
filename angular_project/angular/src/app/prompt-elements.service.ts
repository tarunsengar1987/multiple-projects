import { ViewContainerRef, Injectable, Type } from '@angular/core';
import { Project } from './model/task.model';
import { HumanLoopChatComponent } from './promptui/human-loop-chat/human-loop-chat.component';
import { MilestoneComponent } from './promptui/milestone/milestone.component';
import { GanttComponent } from './gantt/gantt.component';
import { UrllistComponent } from './jsonvisuals/urllist/urllist.component';
import { CustomerListComponent } from './jsonvisuals/customer-list/customer-list.component';
import { ChecklistComponent } from './jsonvisuals/checklist/checklist.component';

@Injectable({
  providedIn: 'root'
})
export class PromptElementsService {

  //must match the endpoint names in the DB, actions type holds the key string that matches to an Angular component
  registeredPromptComponents = new Map<string, Type<any>>([
    ["create_gdocEngine",HumanLoopChatComponent],
    ["Tasklist",MilestoneComponent],
    ["Gantt", GanttComponent],
    ["UrlList", UrllistComponent],
    ["CustomerList", CustomerListComponent],
    ["Checklist", ChecklistComponent]
  ]);

  constructor(
    
  ) { }

  isRegisteredComponent(componentName: string) : boolean{
    if(this.registeredPromptComponents.has(componentName)) return true;
    return false;
  }

  loadComponent(keyString: string, container : ViewContainerRef, metadata: { [key: string]: any }) {
    let parts = keyString.split(".");
    keyString = parts[parts.length-1];
    console.log("Loading container...", keyString);
    let componentType = this.registeredPromptComponents.get(keyString);
    let componentRef;

    if(componentType != undefined){
      componentRef = container.createComponent(componentType);
      if(keyString == "create_gdocEngine") componentRef.instance.question = metadata["generated_text"];
      else {
        const jsonData = JSON.parse(metadata["generated_text"]);
        console.log("Parsed Json data", jsonData);
        componentRef.instance.data = jsonData;
      }
    }
  }
}
