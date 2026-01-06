import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { EmbeddingAgents } from '../model/agent.model';

@Component({
  selector: 'app-agentchooser',
  templateUrl: './agentchooser.component.html',
  styleUrls: ['./agentchooser.component.scss']
})
export class AgentchooserComponent {

  inputs = "Tell me what you want to do.";
  suggestedAgents : string[] = [];

  constructor(private http: HttpService){}

  submitForm(){
    this.http.matchAgentsToPrompt(this.inputs).subscribe((embeddingAgents : EmbeddingAgents) => {
      console.log("Agents: ", embeddingAgents.documents[0]);
      this.suggestedAgents = embeddingAgents.documents[0];
    });
  }

}
