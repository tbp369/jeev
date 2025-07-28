import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';
import { TaskService } from './services/task';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit {
  title = 'angular-todo-app';

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is already authenticated and redirect accordingly
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        // Refresh tasks when user is authenticated
        this.taskService.refreshTasks();
        
        // If user is on login/signup page and is authenticated, redirect to todo
        const currentUrl = this.router.url;
        if (currentUrl === '/login' || currentUrl === '/signup' || currentUrl === '/') {
          this.router.navigate(['/todo']);
        }
      } else {
        // Clear tasks when user is not authenticated
        this.taskService.clearTasks();
      }
    });
  }
}
