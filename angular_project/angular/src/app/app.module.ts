import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { CookieModule } from 'ngx-cookie';
import { AuthGuardService, AuthService, clientGetToken } from './auth.service';
import { JwtModule } from "@auth0/angular-jwt";
import { LoginComponent } from './login/login.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatGridListModule} from '@angular/material/grid-list';

//Material modules
import { MatDialogModule } from '@angular/material/dialog';
import { PromptComponent } from './prompt/prompt.component';
import { EmployeeComponent } from './employee/employee.component';
import { ProjectForecastComponent } from './project-forecast/project-forecast.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { GanttComponent } from './gantt/gantt.component';
import { TableComponent } from './parts/table/table.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { MatSelectModule } from '@angular/material/select';
import { ErrorComponent } from './error/error.component';
import { IntegrationsComponent } from './integrations/integrations.component';
import { UserComponent } from './admin/user/user.component';
import { ApisComponent } from './integrations/apis/apis.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { CreateAutomationComponent } from './create-automation/create-automation.component';
import { SignupComponent } from './signup/signup.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatChipsModule} from '@angular/material/chips';
import {MatBadgeModule} from '@angular/material/badge';

import { DraglistComponent } from './parts/draglist/draglist.component';
import { CreateAgentComponent } from './create-agent/create-agent.component';
import { DialogComponent } from './parts/dialog/dialog.component';
import { AuthsetupComponent } from './admin/authsetup/authsetup.component';
import { AgentchooserComponent } from './agentchooser/agentchooser.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { AddBucketComponent } from './buckets/add-bucket/add-bucket.component';
import { BucketDetailsComponent } from './buckets/bucket-details/bucket-details.component';
import { FileuploadComponent } from './parts/fileupload/fileupload.component';
import { TruncatePipe } from './truncate.pipe';
import { AddEndpointsComponent } from './endpoints/add-endpoints/add-endpoints.component';
import { EditWorkflowComponent } from './workflow/edit-workflow/edit-workflow.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { MarkdownModule } from 'ngx-markdown';
import { FilterPipe } from './parts/filter.pipe';
import { CreateWorkflowComponent } from './create-workflow/create-workflow.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { BillingComponent } from './admin/billing/billing.component';
import { ProcessLogComponent } from './admin/process-log/process-log.component';
import { CreateUserComponent } from './admin/user/create-user/create-user.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HumanLoopChatComponent } from './promptui/human-loop-chat/human-loop-chat.component';
import { MilestoneComponent } from './promptui/milestone/milestone.component';
import { DocumentsComponent } from './integrations/documents/documents.component';

import { NgxGanttModule } from '@worktile/gantt';
import { GANTT_GLOBAL_CONFIG } from '@worktile/gantt';
import { ProjectplanComponent } from './projectplan/projectplan.component';
import { PlantileComponent } from './projectplan/plantile/plantile.component';
import { HealthCheckComponent } from './health-check/health-check.component';
import { CreateMilestoneComponent } from './promptui/milestone/create-milestone/create-milestone.component';
import { UrllistComponent } from './jsonvisuals/urllist/urllist.component';
import { CustomerListComponent } from './jsonvisuals/customer-list/customer-list.component';
import { AssistantsComponent } from './assistants/assistants.component';
import { ChecklistComponent } from './jsonvisuals/checklist/checklist.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LoginComponent,
    PromptComponent,
    EmployeeComponent,
    ProjectForecastComponent,
    ForgotPassComponent,
    ResetPassComponent,
    GanttComponent,
    TableComponent,
    DashboardComponent,
    ErrorComponent,
    IntegrationsComponent,
    UserComponent,
    ApisComponent,
    CreateAutomationComponent,
    SignupComponent,
    DraglistComponent,
    CreateAgentComponent,
    DialogComponent,
    AuthsetupComponent,
    AgentchooserComponent,
    WorkflowComponent,
    AddBucketComponent,
    BucketDetailsComponent,
    FileuploadComponent,
    TruncatePipe,
    AddEndpointsComponent,
    EditWorkflowComponent,
    FilterPipe,
    CreateWorkflowComponent,
    HomeAdminComponent,
    BillingComponent,
    ProcessLogComponent,
    CreateUserComponent,
    HumanLoopChatComponent,
    MilestoneComponent,
    ProjectplanComponent,
    PlantileComponent,
    DocumentsComponent,
    HealthCheckComponent,
    CreateMilestoneComponent,
    UrllistComponent,
    CustomerListComponent,
    AssistantsComponent,
    ChecklistComponent
  ],
  imports: [
    BrowserModule,
    MatTableModule,
    MatBadgeModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatDialogModule,
    DragDropModule,
    NgxGanttModule,
    AppRoutingModule,
    MatPaginatorModule,
    MatChipsModule,
    FormsModule,
    FullCalendarModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSliderModule,
    FullCalendarModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatMenuModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatToolbarModule,
    HttpClientModule,
    CanvasJSAngularChartsModule,
    CookieModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => clientGetToken(),
        allowedDomains: ['localhost:8080', 'localhost:8090', 'doings.de', 'doings.ai', 'localhost:5000', '127.0.0.1:5000'],
        //disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
  ],
  providers: [
    AuthGuardService,
    AuthService,
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        dateFormat: {
             yearQuarter: `QQQ 'of' yyyy`,
             month: 'LLLL',
             yearMonth: `LLLL yyyy'(week' w ')'`
        }
      }
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
