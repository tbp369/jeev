import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { NotificationService } from '../../services/notification.service';
import { Document } from '../../models/document.model';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    FormsModule,
    RouterModule
  ],
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  loading = false;
  searchQuery = '';
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  searchTimeout: any;

  constructor(
    private documentService: DocumentService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    
    const loadFunction = this.searchQuery.trim() 
      ? this.documentService.searchDocuments(this.searchQuery, this.currentPage, this.pageSize)
      : this.documentService.getAllDocuments(this.currentPage, this.pageSize);

    loadFunction.subscribe({
      next: (response) => {
        this.documents = response.content || response;
        this.totalPages = response.totalPages || 0;
        this.totalElements = response.totalElements || this.documents.length;
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Failed to load documents');
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 0;
      this.loadDocuments();
    }, 500);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDocuments();
  }

  viewDocument(doc: Document): void {
    this.router.navigate(['/documents', doc.id]);
  }

  editDocument(doc: Document): void {
    this.router.navigate(['/documents', doc.id, 'edit']);
  }

  deleteDocument(doc: Document): void {
    if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
      this.documentService.deleteDocument(doc.id!).subscribe({
        next: () => {
          this.notificationService.success('Document deleted successfully');
          this.loadDocuments();
        },
        error: () => {
          this.notificationService.error('Failed to delete document');
        }
      });
    }
  }

  downloadDocument(doc: Document): void {
    this.documentService.downloadFile(doc.id!, doc.fileName || 'download').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a'); // now safe
        link.href = url;
        link.download = doc.fileName || 'download';
        link.click();
        window.URL.revokeObjectURL(url);
        this.notificationService.success('Download started');
      },
      error: () => {
        this.notificationService.error('Failed to download file');
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return 'Unknown';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  }
}

