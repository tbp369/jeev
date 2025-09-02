export interface Document {
  id?: number;
  title: string;
  description: string;
  uploadedBy: string;
  uploadDate?: string;
  fileSize?: number;
  fileName?: string;
  fileType?: string;
}

export interface DocumentUpload {
  title: string;
  description: string;
  uploadedBy: string;
  file: File;
}

export interface FileChunk {
  chunkNumber: number;
  totalChunks: number;
  fileName: string;
  data: ArrayBuffer;
}

export interface UploadProgress {
  percentage: number;
  uploadedChunks: number;
  totalChunks: number;
  isComplete: boolean;
}

