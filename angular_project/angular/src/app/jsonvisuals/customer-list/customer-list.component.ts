import { Component } from '@angular/core';

export interface Customer{
  name: string,
  size: number,
  revenue: number,
  country: string,
  city: string,
  event: string
}

export interface CustomerList{
  customers: Customer[]
}

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent {
  data! : CustomerList;
}
