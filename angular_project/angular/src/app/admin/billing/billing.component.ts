import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { CanvasJS } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  constructor(private http:HttpClient){}

  monthlybilling: {label: string, y:number}[] = [
    { label: "1", y: 10 },
    { label: "2", y: 15 },
    { label: "3", y: 25 },
    { label: "4", y: 30 },
    { label: "5", y: 28 },
    { label: "6", y: 10 },
    { label: "7", y: 15 },
    { label: "8", y: 25 },
    { label: "9", y: 30 },
    { label: "10", y: 28 },
    { label: "11", y: 10 },
    { label: "12", y: 15 },
    { label: "13", y: 25 },
    { label: "14", y: 50 },
    { label: "15", y: 28 },
    { label: "16", y: 10 },
    { label: "17", y: 15 },
    { label: "18", y: 25 },
    { label: "19", y: 30 },
    { label: "20", y: 28 },
    { label: "21", y: 10 },
    { label: "22", y: 15 },
    { label: "23", y: 25 },
    { label: "24", y: 30 },
    { label: "25", y: 28 },
    { label: "26", y: 10 },
    { label: "27", y: 15 },
    { label: "28", y: 25 },
    { label: "29", y: 30 },
    { label: "30", y: 28 }
  ]

  dataOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Tokens used per day in"
    },
    axisX:{
      title:"Days of the Month"
    },
    axisY: {
      title: "Tokens"
    },
    data: [{
      type: "column",
      color: "#66bb6a",
      dataPoints: this.monthlybilling
    }]
  };

  monthlydata:any
  selectedValue: any;
  chartOptions:any

  ngOnInit(){
    this.http.get('assets/monthly-billing-data.json').subscribe((data:any) =>{
      console.log(data)
      this.monthlydata = data;
    })
    console.log(this.selectedValue)
  }
  
  onSelectionChange(event:any): void {
    this.selectedValue = event.value;
    console.log('Selected value:', this.selectedValue);
    this.fetchChartData();
  }

  fetchChartData(): void {
      this.monthlydata.forEach((element:any) => {
        if(element.month == this.selectedValue){
          this.monthlybilling = element.data;
          console.log(this.monthlybilling)
        }
      });
      this.prepareChartOptions();
      this.renderChart();
  }

  prepareChartOptions(){
    this.chartOptions = {
      animationEnabled: true,
      theme: "light2",
      title: {
        text: "Tokens used per day"
      },
      axisX:{
        title:"Days of the Month"
      },
      axisY: {
        title: "Tokens"
      },
      data: [{
        type: "column",
        color: "#66bb6a",
        dataPoints: this.monthlybilling
      }]
    };
  }

  renderChart(){
    //let chart = new CanvasJS.Chart("chartContainer", this.chartOptions);
    //chart.render();
  }

}
