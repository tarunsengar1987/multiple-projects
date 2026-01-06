import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { HttpService } from 'src/app/http.service';
import { Option } from 'src/app/model/option.model';
import { SharedEventService } from 'src/app/shared-event.service';
import { AuthService } from 'src/app/auth.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ApiEndpoint } from 'src/app/model/api.model';
import { Bucket } from 'src/app/model/bucket.model';
import { Customer } from 'src/app/model/customer.model';

interface TableSelectable{
  id: number;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> implements OnInit{
  @Input() displayedColumns: string[] = [];
  @Input() dataSource!: MatTableDataSource<T>;
  @Input() funcList: Option[] = [];

  //if a table is used inside a stepper you can use the functions button for next step action too
  @Input() stepper: boolean = false;
  @Input() singleAction: String = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedOption : Option = {tooltip:"Empty",apiname:"Empty",name:"Empty",values:[]}

  selection = new SelectionModel<T>(true, []);
  @Input() selectedElements : T[] = []

  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();

  endpointsLoaded: Subscription = new Subscription();
  

  constructor(public http: HttpService, public eventService: SharedEventService, public auth: AuthService, private sanitizer: DomSanitizer) {
    
  }

  callGenericMethodOnItem(item: T, methodname: string) {
    // Use a type assertion to tell TypeScript that item has a method named testMethod
    (item as any).methodname?.();
  }

  selectItemsIntable(){
    let selectedIds = []

    for(let element of this.selectedElements){
      selectedIds.push((element as TableSelectable).id);
    }

    for(let d of this.dataSource.data){
      if(selectedIds.indexOf((d as TableSelectable).id) !== -1){
        this.selection.select(d);
      }
      
    }
  }

  ngOnInit(): void {
    
  }

  sanitizeVol(vol: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(vol.replace(/(\n)+/g, '<br>'));
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if dataSource has changed
    if (changes['dataSource']) {
      this.selectItemsIntable();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //------------------------
  fireFunctionByParameter(parameter1:string,parameter: string, http: HttpService, args: any[] = [], multi: boolean = false, eventService : SharedEventService = this.eventService, authService : AuthService = this.auth) {
    if(multi == false) //function fired once per selected item
    {
      this.selection.selected.forEach(element => {
        console.log("Multi false", multi, parameter);
        (element as { [key: string]: (args: any[], http: HttpService) => void })[parameter](args,http);
      });
    }else{ //function fired only once but on the whole selection (delivered by args[0])
      if(this.selection != null && this.selection.selected[0] != null)
        (this.selection.selected[0] as { [key: string]: (args: any[], http: HttpService, multi: boolean, eventService : SharedEventService, authService : AuthService) => void })[parameter](args,http,false,eventService,authService);
      else{
        //TODO hardcoded REFACTOR!
          let dummyObject;
          console.log("Bucket check", args[2] != "bucket", args[2]);
          if(args[2] != "buckets") dummyObject = new ApiEndpoint("",0);
          else dummyObject = new Bucket(0,"defaultbucket","","",new Customer(0, "defaultcustomer"));

          dummyObject.edit(args,http,false,eventService,authService);
        
      }
    }
    this.eventService.tableChanged(true); //TODO make the fired function return a bool and use it here
  }

  fireSingleAction(object: any){
    object["singleAction"](this.auth);
  }

  singleActionDisabled(object: any){
    return object["singleActionDisabled"](this.auth);
  }

  fireFunctionOnSelection(){
    console.log("Once");
    this.selection.selected.forEach(element => {
      console.log("On selection",element);
    });
  }

  handleSelectionChange(event: any, row: any): void {
    this.selection.toggle(row);
    console.log("Selected: ", this.selection.selected);
    this.selectionChange.emit(this.selection.selected);
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
}