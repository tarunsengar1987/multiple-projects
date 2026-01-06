import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';
import { Connection, Project, Task } from './model/task.model';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private BASE_URL = environment.getApiUrl();

  constructor(private http: HttpClient) { }

  createTask(){

  }

  deleteTask(){

  }

  updateTask(task: Task) : Observable<boolean>{
    return this.http.put<boolean>(this.BASE_URL + '/todo/', task);
  }

  public toggleState(task : Task, state: boolean) : Observable<boolean> {
    console.log('new state for task', state);
    task.done = state;
    return this.http.get<boolean>(this.BASE_URL + '/todo/changestate/' + task.id + '/' + state);
  }

  getTasks() : Observable<Task[]>{
    return this.http.get<Task[]>(this.BASE_URL + '/todo/');
  }

  //TODO could be refactored, but then whole graph approach must maybe be changed
  getConnections(tasks : Task[]) : Connection[]{
    let connection : Connection[] = [];
    tasks.forEach(task => {
      task.children.forEach(child => {
        connection.push(new Connection(child.id, task.id));
      });
    });
    return connection;
  }

  async getProject() : Promise<Project>{
    let tasks = await lastValueFrom(this.getTasks());
    let connections = this.getConnections(tasks);
    let project = new Project(tasks, connections);
    console.log("Project created: ", tasks, connections, project);
    return project;
  }
}
