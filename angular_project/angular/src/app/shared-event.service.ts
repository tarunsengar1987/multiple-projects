import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { InfData } from './create-automation/create-automation.component';
import { WorkflowsWithContext } from './model/agent.model';
import { Api } from './model/api.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SharedEventService {

  constructor(private snackbar:MatSnackBar) { }

  // Observable string sources
  private tableManagerSubject = new Subject<boolean>();
  private tableFunctionExecutedSubject = new Subject<InfData[]>();
  private workflowManagerSubject = new Subject<WorkflowsWithContext>();
  private endpointCreationSubject = new Subject<Api[]>();
  private humanLoopAnswerSubject = new Subject<string>();

  // Observable string streams
  tableManagerSubject$ = this.tableManagerSubject.asObservable();
  tableFunctionExecutedSubject$ = this.tableFunctionExecutedSubject.asObservable();
  workflowManagerSubject$ = this.workflowManagerSubject.asObservable();
  endpointCreationSubject$ = this.endpointCreationSubject.asObservable();
  humanLoopAnswerSubject$ = this.humanLoopAnswerSubject.asObservable();

  apiChosen(apis: Api[]){
    this.endpointCreationSubject.next(apis);
  }

  workflowReady(data: WorkflowsWithContext){
    this.workflowManagerSubject.next(data);
  }

  // Service message commands
  tableChanged(message: boolean) {
    this.tableManagerSubject.next(message);
  }

  tableFunctionExecuted(data : InfData[]){
    this.tableFunctionExecutedSubject.next(data);
  }

  humanLoopAnswer(message: string){
    this.humanLoopAnswerSubject.next(message);
  }
  
  openSnackBar(message: string, action: string): void {
    this.snackbar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top', 
      horizontalPosition: 'left' 
    });
  }
}
