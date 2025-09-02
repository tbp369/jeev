import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

// Any other providers such as services & guards
import { AuthService } from './services/auth.service';
import { DocumentService } from './services/document.service';
import { NotificationService } from './services/notification.service';
import { AuthGuard } from './guards/auth.guard';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(AppRoutingModule),
    AuthService,
    DocumentService,
    NotificationService,
    AuthGuard,
  ]
});
