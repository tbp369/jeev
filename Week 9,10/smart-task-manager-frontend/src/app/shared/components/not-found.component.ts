import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <mat-icon class="not-found-icon">error_outline</mat-icon>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <button mat-raised-button color="primary" routerLink="/dashboard">
          <mat-icon>home</mat-icon>
          Go to Dashboard
        </button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .not-found-content {
      text-align: center;
      background: white;
      padding: 60px 40px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 100%;
    }

    .not-found-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #666;
      margin-bottom: 20px;
    }

    h1 {
      color: #333;
      margin-bottom: 16px;
      font-weight: 300;
    }

    p {
      color: #666;
      margin-bottom: 32px;
      line-height: 1.6;
    }

    button {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 auto;
    }
  `]
})
export class NotFoundComponent {}

