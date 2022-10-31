import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth.guard';

/* tslint:disable */ 
const routes: Routes = [
  { path: '', 
    redirectTo: 'welcome', 
    pathMatch: 'full' 
  }, // ================= Auth start ===================================
  { 
    path: 'auth',
    loadChildren: './pages/auth/auth.module#AuthPageModule',
  },
  { 
    path: 'forgot-password',
    loadChildren: './pages/auth/forgot-password/forgot-password.module#ForgotPasswordPageModule'
  },
  { 
    path: 'employee/:id', 
    loadChildren: './pages/user_management/user-list/user-list.module#UserListPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'add-employee/:type/:id', 
    loadChildren: './pages/user_management/add-user/add-user.module#AddUserPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'profile-view/:id',
    loadChildren: './pages/student_management/profile-view/profile-view.module#ProfileViewPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'your-attendance/:id', 
    loadChildren: './pages/student_management/attandance/attandance.module#AttandancePageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'attendance/:id', 
    loadChildren: './pages/student_management/all-attandance/all-attandance.module#AllAttandancePageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'welcome', 
    loadChildren: './pages/welcome/welcome.module#WelcomePageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'project-management/:id', 
    loadChildren: './pages/project_management/project-list/project-list.module#ProjectListPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'add-project/:type/:id', 
    loadChildren: './pages/project_management/add-project/add-project.module#AddProjectPageModule', 
    canLoad: [AuthGuard]
  },
  { 
    path: 'task/:id', 
    loadChildren: './pages/project_management/work-list/work-list.module#WorkListPageModule', 
    canLoad: [AuthGuard] 
  },
  { 
    path: 'task-list/:id', 
    loadChildren: './pages/project_management/task-list/task-list.module#TaskListPageModule', 
    canLoad: [AuthGuard]
  },
  { 
    path: 'add-work/:action/:id', 
    loadChildren: './pages/project_management/add-work/add-work.module#AddWorkPageModule', 
    canLoad: [AuthGuard]
  },
  { 
    path: 'add-task/:action/:id', 
    loadChildren: './pages/project_management/add-task/add-task.module#AddTaskPageModule', 
    canLoad: [AuthGuard]
  },
  { 
    path: 'project-details/:id', 
    loadChildren: './pages/project_management/project-details/project-details.module#ProjectDetailsPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'dashboard/:id', 
    loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'add-student/:action/:id', 
    loadChildren: './pages/student_management/add-student/add-student.module#AddStudentPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'student', 
    loadChildren: './pages/student_management/student-list/student-list.module#StudentListPageModule',
    canLoad: [AuthGuard]
  },
  { 
  path: 'payment',
  loadChildren: './pages/payment_management/payment-list/payment-list.module#PaymentListPageModule',
  canLoad: [AuthGuard]
  },
  { 
  path: 'add-payment/:action/:id',
  loadChildren: './pages/payment_management/payment-add/payment-add.module#PaymentAddPageModule',
  canLoad: [AuthGuard]
},
{
    path: 'leave/:id',
    loadChildren: './pages/leave_management/leave-list/leave-list.module#LeaveListPageModule',
    canLoad: [AuthGuard]
 },
  { 
    path: 'leave-request-list', 
    loadChildren: './pages/leave_management/leave-request-list/leave-request-list.module#LeaveRequestListPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'pf-esi-add/:type/:id',
    loadChildren: './pages/pf_esi_management/pf-esi-add/pf-esi-add.module#PfEsiAddPageModule',
    canLoad: [AuthGuard]
  },
  { path: 'pfandesi/:id', 
    loadChildren: './pages/pf_esi_management/pf-esi-list/pf-esi-list.module#PfEsiListPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'salary-add/:type/:id',
    loadChildren: './pages/salary_management/salary-add/salary-add.module#SalaryAddPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'salary/:id', 
    loadChildren: './pages/salary_management/salary-list/salary-list.module#SalaryListPageModule',
    canLoad: [AuthGuard]
  },
  { path: 'workupdate-list/:id',
   loadChildren: './pages/project_management/workupdate-list/workupdate-list.module#WorkupdateListPageModule',
   canLoad: [AuthGuard]
  },
  { 
    path: 'salary-process/:type/:id',
    loadChildren: './pages/salary_process/salary-process/salary-process.module#SalaryProcessPageModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'leave-add/:type/:id',
    loadChildren: './pages/your_leave/leave-add/leave-add.module#LeaveAddPageModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'your-leave/:id',
    loadChildren: './pages/your_leave/leave-emplist/leave-emplist.module#LeaveEmplistPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'add-client/:type/:id', 
    loadChildren: './pages/client_management/add-client/add-client.module#AddClientPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'client/:id',
    loadChildren: './pages/client_management/client-list/client-list.module#ClientListPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'social-posts/:id', 
    loadChildren: './pages/social-posts/social-posts.module#SocialPostsPageModule',
    canLoad: [AuthGuard]
  },
  { path: 'add-social-posts/:type/:id',
    loadChildren: './pages/social-posts/add-social-posts/add-social-posts.module#AddSocialPostsPageModule',
    canLoad: [AuthGuard]
  },
  { path: 'task-review/:id',
    loadChildren: './pages/project_management/task-review/task-review.module#TaskReviewPageModule',
    canLoad: [AuthGuard]
  }


];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes, {useHash: false, preloadingStrategy: PreloadAllModules }) // --Hash removed server
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// RouterModule.forRoot(routes, { useHash: true })