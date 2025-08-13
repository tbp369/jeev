import { Component } from '@angular/core';
import { TaskListComponent } from './task-list.component';

@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [TaskListComponent],
  template: `<app-task-list></app-task-list>`
})
export class AllTasksComponent {}

