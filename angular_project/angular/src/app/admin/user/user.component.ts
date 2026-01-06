import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { HttpService } from 'src/app/http.service';
import { AppUser } from 'src/app/model/appuser.model';
import { Option } from 'src/app/model/option.model';
import { LanguageService } from 'src/app/language.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/parts/dialog/dialog.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { SharedEventService } from 'src/app/shared-event.service';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth.service';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  isButtonDisabled = false;
  dataSource!: MatTableDataSource<AppUser, MatTableDataSourcePaginator>;
  displayedColumns: string[] = ["name"];
  appUsers: AppUser[] = [];
  funcList: Option[] = [{tooltip:"",apiname:"", name: "delete", values: []}];
  selectedLanguage = "english";
  buttonLabel:any
  tooltipLabel:any
  user:any
  BASE_LINK = environment.getBaseLink();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpService,private languageservice:LanguageService,private dialog: MatDialog, private auth: AuthService){
    this.http.getList<AppUser>("user").subscribe(users => {
      users.forEach(user => {
        this.appUsers.push(new AppUser(user.id,user.username,user.email,user.enabled,user.googleToken,user.customer));
      });
      this.user = users;
      console.log(this.user)
    });
    
    this.dataSource = new MatTableDataSource<AppUser>(this.appUsers);
    this.dataSource.paginator = this.paginator;
    this.updateLabel();
  }

  copyRegistrationLink(){
    navigator.clipboard.writeText(this.BASE_LINK + "/register/" + this.auth.me()["user"]["customer"]["id"])
  }

  updateLabel(){
    this.funcList.forEach(element => {
      this.buttonLabel = this.languageservice.getLabel(this.selectedLanguage, element.name);
      element.apiname = this.buttonLabel;
      this.tooltipLabel = this.languageservice.getTooltip(this.selectedLanguage, element.name);
      element.tooltip = this.tooltipLabel;
    });
  }

  createuser(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "Create New User",
        component: CreateUserComponent,
        componentData: {
          data : {

          }
        }
      }    
    });  
  }

  toggleUserStatus(user: any) {
    console.log(user,user.enabled)
    this.http.userStatus(user,user.enabled)
  }

  ngOnInit(): void {
    
  }

  handleSelectionChange(event: any){

  }

}
