import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Document, DocumentUpload, FileChunk, UploadProgress } from '../models/document.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl;
  private uploadProgressSubject = new BehaviorSubject<UploadProgress>({
    percentage: 0,
    uploadedChunks: 0,
    totalChunks: 0,
    isComplete: false
  });
  public uploadProgress$ = this.uploadProgressSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllDocuments(page: number = 0, size: number = 10): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/metadata/documents?page=${page}&size=${size}`, { headers });
  }

  getDocumentById(id: number): Observable<Document> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Document>(`${this.apiUrl}/metadata/documents/${id}`, { headers });
  }

  searchDocuments(query: string, page: number = 0, size: number = 10): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/metadata/documents/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`, { headers });
  }

  createDocument(document: Omit<Document, 'id'>): Observable<Document> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<Document>(`${this.apiUrl}/metadata/documents`, document, { headers });
  }

  updateDocument(id: number, document: Partial<Document>): Observable<Document> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<Document>(`${this.apiUrl}/metadata/documents/${id}`, document, { headers });
  }

  deleteDocument(id: number): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/metadata/documents/${id}`, { headers });
  }

  uploadFileInChunks(documentUpload: DocumentUpload): Observable<any> {
    return new Observable(observer => {
      const file = documentUpload.file;
      const chunkSize = 1024 * 1024; // 1MB chunks
      const totalChunks = Math.ceil(file.size / chunkSize);
      let uploadedChunks = 0;

      // First create the document metadata
      this.createDocument({
        title: documentUpload.title,
        description: documentUpload.description,
        uploadedBy: documentUpload.uploadedBy,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      }).subscribe({
        next: (document) => {
          // Start uploading chunks
          this.uploadChunks(file, document.id!, totalChunks, chunkSize, 0, observer);
        },
        error: (error) => observer.error(error)
      });
    });
  }

  private uploadChunks(file: File, documentId: number, totalChunks: number, chunkSize: number, chunkIndex: number, observer: any): void {
    if (chunkIndex >= totalChunks) {
      this.uploadProgressSubject.next({
        percentage: 100,
        uploadedChunks: totalChunks,
        totalChunks: totalChunks,
        isComplete: true
      });
      observer.next({ success: true, documentId });
      observer.complete();
      return;
    }

    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('chunkNumber', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('fileName', file.name);
    formData.append('documentId', documentId.toString());

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    this.http.post(`${this.apiUrl}/files/upload-chunk`, formData, { 
      headers,
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          const uploadedChunks = chunkIndex + 1;
          const percentage = Math.round((uploadedChunks / totalChunks) * 100);
          
          this.uploadProgressSubject.next({
            percentage,
            uploadedChunks,
            totalChunks,
            isComplete: false
          });

          // Upload next chunk
          this.uploadChunks(file, documentId, totalChunks, chunkSize, chunkIndex + 1, observer);
        }
      },
      error: (error) => observer.error(error)
    });
  }

  downloadFile(documentId: number, fileName: string): Observable<Blob> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/files/download/${documentId}`, {
      headers,
      responseType: 'blob'
    });
  }

  getFilePreview(documentId: number): Observable<Blob> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/files/preview/${documentId}`, {
      headers,
      responseType: 'blob'
    });
  }

  resumeUpload(documentId: number, file: File, uploadedChunks: number): Observable<any> {
    return new Observable(observer => {
      const chunkSize = 1024 * 1024; // 1MB chunks
      const totalChunks = Math.ceil(file.size / chunkSize);
      
      // Resume from the next chunk after the last uploaded one
      this.uploadChunks(file, documentId, totalChunks, chunkSize, uploadedChunks, observer);
    });
  }

  resetUploadProgress(): void {
    this.uploadProgressSubject.next({
      percentage: 0,
      uploadedChunks: 0,
      totalChunks: 0,
      isComplete: false
    });
  }
}

