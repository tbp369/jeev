import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { DocumentDetailComponent } from './components/document-detail/document-detail.component';
import { DocumentEditComponent } from './components/document-edit/document-edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/documents', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'documents', 
    component: DocumentListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'upload', 
    component: DocumentUploadComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'documents/:id', 
    component: DocumentDetailComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'documents/:id/edit', 
    component: DocumentEditComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '/documents' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

