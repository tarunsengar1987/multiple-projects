import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './auth.service';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PromptComponent } from './prompt/prompt.component';
import { EmployeeComponent } from './employee/employee.component';
import {ForgotPassComponent} from "./forgot-pass/forgot-pass.component";
import {ResetPassComponent} from "./reset-pass/reset-pass.component";
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminGuardService } from './adminauth.service';
import { ErrorComponent } from './error/error.component';
import { IntegrationsComponent } from './integrations/integrations.component';
import { UserComponent } from './admin/user/user.component';
import { ApisComponent } from './integrations/apis/apis.component';
import { CreateAutomationComponent } from './create-automation/create-automation.component';
import { SignupComponent } from './signup/signup.component';
import { DraglistComponent } from './parts/draglist/draglist.component';
import { CreateAgentComponent } from './create-agent/create-agent.component';
import { AuthsetupComponent } from './admin/authsetup/authsetup.component';
import { AgentchooserComponent } from './agentchooser/agentchooser.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { AddBucketComponent } from './buckets/add-bucket/add-bucket.component';
import { BucketDetailsComponent } from './buckets/bucket-details/bucket-details.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { BillingComponent } from './admin/billing/billing.component';
import { ProcessLogComponent } from './admin/process-log/process-log.component';

import { GanttComponent } from './gantt/gantt.component';
import { PlantileComponent } from './projectplan/plantile/plantile.component';
import { MilestoneComponent } from './promptui/milestone/milestone.component';
import { DocumentsComponent } from './integrations/documents/documents.component';
import { HealthCheckComponent } from './health-check/health-check.component';
import { AssistantsComponent } from './assistants/assistants.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'assistants',
        component: AssistantsComponent
      },
      {
        path: 'milestone',
        component: MilestoneComponent
      },
      {
        path: 'automation/create',
        component: CreateAutomationComponent
      },
      {
        path: 'addbuckets/:agentId',
        component: AddBucketComponent
      },
      {
        path: 'workflow',
        component: WorkflowComponent
      },
      {
        path: 'workflowold',
        component: CreateAutomationComponent
      },
      {
        path: 'choose',
        component: AgentchooserComponent
      },
      {
        path: 'agent/create',
        component: CreateAgentComponent
      },
      {
        path:'integrations/documents',
        component: DocumentsComponent
      },
      {
        path: 'integrations/apis/:apiName',
        component: ApisComponent
      },
      {
        path: 'integrations/apis',
        component: ApisComponent
      },
      {
        path: 'integrations/:id',
        component: IntegrationsComponent
      },
      {
        path: 'employee/:id',
        component: EmployeeComponent
      },
      {
        path: 'prompt',
        component: PromptComponent
      },
      {
        path: 'prompt/:id',
        component: PromptComponent
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [AdminGuardService],
    children: [
      {
        path: 'AdminHome',
        component: HomeAdminComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'user',
        component: UserComponent
      },
      {
        path:'billing',
        component: BillingComponent
      },
      {
        path: 'authsetup',
        component: AuthsetupComponent
      },
      {
        path: 'process-log',
        component: ProcessLogComponent
      }
    ]
  },
  {
    path: 'health',
    component: HealthCheckComponent
  },
  {
    path: 'login/:apiName',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'bucketdetails/:bucketName',
    component: BucketDetailsComponent
  },
  {
    path: 'list',
    component: DraglistComponent
  },
  {
    path: 'register/:customerId',
    component: SignupComponent
  },
  { path: 'users/forgot-password', component: ForgotPassComponent },
  { path: 'users/reset-password', component: ResetPassComponent },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'error',
    component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
