import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { DocumentService } from '../../services/document.service';
import { NotificationService } from '../../services/notification.service';
import { Document } from '../../models/document.model';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  styleUrls: ['./document-edit.component.scss']
})
export class DocumentEditComponent implements OnInit {
  editForm: FormGroup;
  document: Document | null = null;
  loading = true;
  saving = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private notificationService: NotificationService
  ) {
    this.editForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadDocument(+id);
    }
  }

  loadDocument(id: number): void {
    this.loading = true;
    this.documentService.getDocumentById(id).subscribe({
      next: (document) => {
        this.document = document;
        this.editForm.patchValue({
          title: document.title,
          description: document.description
        });
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Failed to load document');
        this.loading = false;
        this.router.navigate(['/documents']);
      }
    });
  }

  get f() { return this.editForm.controls; }

  onSubmit(): void {
    if (this.editForm.invalid || !this.document?.id) {
      this.markFormGroupTouched();
      return;
    }

    this.saving = true;
    const updateData = {
      title: this.editForm.value.title,
      description: this.editForm.value.description
    };

    this.documentService.updateDocument(this.document.id, updateData).subscribe({
      next: (updatedDocument) => {
        this.notificationService.success('Document updated successfully!');
        this.router.navigate(['/documents', this.document!.id]);
      },
      error: (error) => {
        this.notificationService.error('Failed to update document');
        this.saving = false;
      }
    });
  }

  cancel(): void {
    if (this.document?.id) {
      this.router.navigate(['/documents', this.document.id]);
    } else {
      this.router.navigate(['/documents']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.editForm.controls).forEach(key => {
      this.editForm.get(key)?.markAsTouched();
    });
  }



  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return 'Unknown';

    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  downloadDocument() {

  }
}

