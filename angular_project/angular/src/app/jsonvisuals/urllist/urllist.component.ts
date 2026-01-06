import { Component, OnInit } from '@angular/core';

export interface UrlList{
  urls: string[]
}

@Component({
  selector: 'app-urllist',
  templateUrl: './urllist.component.html',
  styleUrls: ['./urllist.component.scss']
})
export class UrllistComponent implements OnInit {

  data! : UrlList;

  ngOnInit(): void {
    console.log("DATA", this.data);
  }

}
