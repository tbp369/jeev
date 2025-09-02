import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { DocumentService } from '../../services/document.service';
import { NotificationService } from '../../services/notification.service';
import { Document } from '../../models/document.model';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss']
})
export class DocumentDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private documentService = inject(DocumentService);
  private notificationService = inject(NotificationService);
  private sanitizer = inject(DomSanitizer);

  document: Document | null = null;
  loading = true;

  // Preview
  canPreview = false;
  previewLoading = false;
  previewUrl: string | null = null;                 // raw object URL
  previewSafeUrl: SafeResourceUrl | null = null;     // sanitized for iframe PDF

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!Number.isNaN(id)) {
        this.loadDocument(id);
      } else {
        this.notificationService.error('Invalid document id');
        this.router.navigate(['/documents']);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }

  private loadDocument(id: number): void {
    this.loading = true;
    this.documentService.getDocumentById(id).subscribe({
      next: (doc) => {
        this.document = doc;
        this.loading = false;
        this.checkPreviewSupport();
      },
      error: () => {
        this.notificationService.error('Failed to load document');
        this.loading = false;
        this.router.navigate(['/documents']);
      }
    });
  }

  private checkPreviewSupport(): void {
    const type = this.document?.fileType ?? '';
    const previewable = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain'
    ];
    this.canPreview = previewable.includes(type);
  }

  loadPreview(): void {
    if (!this.document?.id || !this.canPreview) return;

    this.previewLoading = true;
    this.documentService.getFilePreview(this.document.id).subscribe({
      next: (blob) => {
        // clean up previous object URL if any
        if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);

        this.previewUrl = URL.createObjectURL(blob);
        // For PDFs in iframe, Angular requires a SafeResourceUrl
        if (this.document?.fileType === 'application/pdf') {
          this.previewSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
        } else {
          this.previewSafeUrl = null; // not used for images/text
        }

        this.previewLoading = false;
      },
      error: () => {
        this.notificationService.error('Failed to load preview');
        this.previewLoading = false;
      }
    });
  }

  downloadDocument(): void {
    if (!this.document?.id || !this.document?.fileName) return;

    this.documentService.downloadFile(this.document.id, this.document.fileName).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.document!.fileName || 'download';
        link.click();
        URL.revokeObjectURL(url);
        this.notificationService.success('Download started');
      },
      error: () => this.notificationService.error('Failed to download file')
    });
  }

  editDocument(): void {
    if (this.document?.id) {
      this.router.navigate(['/documents', this.document.id, 'edit']);
    }
  }

  deleteDocument(): void {
    if (!this.document?.id) return;

    if (confirm(`Are you sure you want to delete "${this.document.title}"?`)) {
      this.documentService.deleteDocument(this.document.id).subscribe({
        next: () => {
          this.notificationService.success('Document deleted successfully');
          this.router.navigate(['/documents']);
        },
        error: () => this.notificationService.error('Failed to delete document')
      });
    }
  }

  formatFileSize(bytes?: number): string {
    if (bytes == null || Number.isNaN(bytes)) return 'Unknown';
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const val = bytes / Math.pow(1024, i);
    return `${Math.round(val * 100) / 100} ${sizes[i]}`;
  }

  formatDate(dateInput?: string | Date): string {
    if (!dateInput) return 'Unknown';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'Unknown';
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getFileTypeIcon(fileType?: string): string {
    if (!fileType) return 'insert_drive_file';
    if (fileType.startsWith('image/')) return 'image';
    if (fileType === 'application/pdf') return 'picture_as_pdf';
    if (fileType.includes('word')) return 'description';
    if (fileType === 'text/plain') return 'text_snippet';
    return 'insert_drive_file';
  }
}
