import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private state: any;

  constructor() { }

  setState(data: any){
    this.state = data;
  }

  getState(){
    return this.state;
  }
}
