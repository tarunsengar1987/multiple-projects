import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { AppUser } from '../model/appuser.model';
import { MatTableDataSource } from '@angular/material/table';
import { SagemakerConfig } from '../model/sagemaker.config.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  health$ : Observable<String> | undefined;
  health_two$ : Observable<String> | undefined;
  health_three$ : Observable<Object> | undefined;

  data = [new SagemakerConfig("Test","Andreas","bla")];
  displayedColumns : string[] = ["endpointConfigName"];
  dataSource = new MatTableDataSource<SagemakerConfig>(this.data);

  currentIndex = 0;
  videos: { src: SafeResourceUrl; }[] = []
  isLoading = true;

  tips: string[] = [
    'Doings can ingest any data you wish, may it be from an API, a Document or a scraped Website.',
    'Did you know? Doings can control other Apps vie API.',
    'Doings is an Agent-AI, meaning the prompts that you generate in your workflows, are just the first step for an autonomous program, that will plan and execute intermediary steps to achieve your goal in the prompt. For this it uses tools, like APIs, other AI models, documents and much more.',
    'Coming soon: Generate charts for your documents with doings.'
  ];
  TipOfTheDay: any;

  prevSlide() {
    this.currentIndex = (this.currentIndex === 0) ? this.videos.length - 1 : this.currentIndex - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex === this.videos.length - 1) ? 0 : this.currentIndex + 1;
  }

  changeTextOnRefresh(): void {
    const TipOfTheDay = Math.floor(Math.random() * this.tips.length);
    this.TipOfTheDay = this.tips[TipOfTheDay];
  }


  constructor(private auth : AuthService, private http : HttpService, private sanitizer: DomSanitizer){

    setTimeout(() => {
      this.videos = [
        { src: this.sanitizer.bypassSecurityTrustResourceUrl('https://www.loom.com/embed/822d4b1513364df3a2828dac1d31bc51?sid=54810129-b1c1-4d22-9f15-aba4bcc89c20') },
        { src: this.sanitizer.bypassSecurityTrustResourceUrl('https://www.loom.com/embed/822d4b1513364df3a2828dac1d31bc51?sid=54810129-b1c1-4d22-9f15-aba4bcc89c20') },
        { src: this.sanitizer.bypassSecurityTrustResourceUrl('https://www.loom.com/embed/822d4b1513364df3a2828dac1d31bc51?sid=54810129-b1c1-4d22-9f15-aba4bcc89c20') }
      ];
      this.isLoading = false;
    }, 3000); // Simulated delay 
    
  }

  ngOnInit(): void {

    this.changeTextOnRefresh();

    this.health$ = this.auth.healthCheck();
    this.health$.subscribe(health => {
      console.log("Arrived: ", health);
    });
  }
  
}
