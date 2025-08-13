import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../core/services/auth.service';
import { User } from '../shared/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule
  ],
  template: `
    <div class="layout-container">
      <mat-toolbar color="primary" class="toolbar">
        <button mat-icon-button (click)="toggleSidenav()">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="app-title">Smart Task Manager</span>
        <span class="spacer"></span>
        
        <!-- User Menu -->
        <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
          <mat-icon>account_circle</mat-icon>
          <span>{{ (currentUser$ | async)?.firstName }} {{ (currentUser$ | async)?.lastName }}</span>
          <mat-icon>arrow_drop_down</mat-icon>
        </button>
        
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="navigateTo('/profile')">
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item (click)="navigateTo('/settings')">
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" opened class="sidenav">
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            
            <a mat-list-item routerLink="/tasks" routerLinkActive="active">
              <mat-icon matListItemIcon>assignment</mat-icon>
              <span matListItemTitle>My Tasks</span>
            </a>
            
            <a mat-list-item routerLink="/tasks/all" routerLinkActive="active" 
               *ngIf="isManagerOrAdmin()">
              <mat-icon matListItemIcon>list</mat-icon>
              <span matListItemTitle>All Tasks</span>
            </a>
            
            <a mat-list-item routerLink="/tasks/create" routerLinkActive="active" 
               *ngIf="isManagerOrAdmin()">
              <mat-icon matListItemIcon>add_task</mat-icon>
              <span matListItemTitle>Create Task</span>
            </a>
            
            <a mat-list-item routerLink="/users" routerLinkActive="active" 
               *ngIf="isManagerOrAdmin()">
              <mat-icon matListItemIcon>people</mat-icon>
              <span matListItemTitle>Users</span>
            </a>
            
            <a mat-list-item routerLink="/analytics" routerLinkActive="active" 
               *ngIf="isManagerOrAdmin()">
              <mat-icon matListItemIcon>analytics</mat-icon>
              <span matListItemTitle>Analytics</span>
            </a>
            
            <a mat-list-item routerLink="/activity-logs" routerLinkActive="active" 
               *ngIf="isAdmin()">
              <mat-icon matListItemIcon>history</mat-icon>
              <span matListItemTitle>Activity Logs</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .layout-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .app-title {
      font-size: 1.2rem;
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sidenav-container {
      flex: 1;
      margin-top: 64px;
    }

    .sidenav {
      width: 250px;
      background-color: #fafafa;
      border-right: 1px solid #e0e0e0;
    }

    .main-content {
      padding: 20px;
      background-color: #f5f5f5;
      min-height: calc(100vh - 64px);
    }

    .active {
      background-color: rgba(63, 81, 181, 0.1) !important;
      color: #3f51b5 !important;
    }

    .active mat-icon {
      color: #3f51b5 !important;
    }

    mat-nav-list a {
      margin-bottom: 4px;
      border-radius: 8px;
      margin-left: 8px;
      margin-right: 8px;
    }

    mat-nav-list a:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  currentUser$: Observable<User | null>;
  sidenavOpened = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }

  isManagerOrAdmin(): boolean {
    return this.authService.hasAnyRole(['ADMIN', 'MANAGER']);
  }
}

