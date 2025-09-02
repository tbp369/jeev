import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DocumentService } from '../../services/document.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { UploadProgress } from '../../models/document.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  imports: [CommonModule,FormsModule,ReactiveFormsModule], 
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit, OnDestroy {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploading = false;
  uploadProgress: UploadProgress = {
    percentage: 0,
    uploadedChunks: 0,
    totalChunks: 0,
    isComplete: false
  };
  private progressSubscription: Subscription = new Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private documentService: DocumentService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.uploadForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      file: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.progressSubscription = this.documentService.uploadProgress$.subscribe(
      progress => this.uploadProgress = progress
    );
  }

  ngOnDestroy(): void {
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
    this.documentService.resetUploadProgress();
  }

  get f() { return this.uploadForm.controls; }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        this.notificationService.error('File size must be less than 100MB');
        this.clearFileSelection();
        return;
      }

      // Validate file type (basic validation)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];

      if (!allowedTypes.includes(file.type)) {
        this.notificationService.warning('File type may not be supported for preview');
      }

      this.selectedFile = file;
      this.uploadForm.patchValue({ file: file.name });
    }
  }

  clearFileSelection(): void {
    this.selectedFile = null;
    this.uploadForm.patchValue({ file: '' });
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) {
      this.markFormGroupTouched();
      return;
    }

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.notificationService.error('You must be logged in to upload documents');
      return;
    }

    this.uploading = true;
    this.documentService.resetUploadProgress();

    const documentUpload = {
      title: this.uploadForm.value.title,
      description: this.uploadForm.value.description,
      uploadedBy: currentUser.username,
      file: this.selectedFile
    };

    this.documentService.uploadFileInChunks(documentUpload).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Document uploaded successfully!');
          this.router.navigate(['/documents']);
        }
      },
      error: (error) => {
        this.notificationService.error('Upload failed. Please try again.');
        this.uploading = false;
      }
    });
  }

  resumeUpload(): void {
    // This would be implemented if we had a way to track interrupted uploads
    // For now, we'll just restart the upload
    this.onSubmit();
  }

  cancelUpload(): void {
    this.uploading = false;
    this.documentService.resetUploadProgress();
    this.notificationService.info('Upload cancelled');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.uploadForm.controls).forEach(key => {
      this.uploadForm.get(key)?.markAsTouched();
    });
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}

