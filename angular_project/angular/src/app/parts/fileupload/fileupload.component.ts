import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { HttpEventType } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SharedEventService } from 'src/app/shared-event.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent {

  @Input() bucketName: string = "";
  @ViewChild('fileUpload') fileUpload: ElementRef | undefined;
  flag = false;
  files: File[] = [];

  constructor(private http: HttpService,private sanitizer: DomSanitizer,private eventservice:SharedEventService) {}

  onFilesSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const selectedFiles = Array.from(input.files);
      this.files.push(...selectedFiles);
      this.flag = this.files.length > 0;
      console.log('Files selected:', this.files);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const transfer = event.dataTransfer;
    if (transfer) {
      const droppedFiles = Array.from(transfer.files);
      this.files.push(...droppedFiles);
      this.flag = this.files.length > 0;
    }
    console.log('Files dropped:', this.files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    console.log('File is over the drop zone');
  }

  onDragLeave(event: DragEvent) {
    console.log('File has left the drop zone');
  }

  onUpload() {
    if (this.files.length > 0) {
      this.http.uploadFile(this.files, this.bucketName).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.Response) {
            this.eventservice.openSnackBar('Upload successful', 'Close');
          }
        }, 
        error: () => {
          this.eventservice.openSnackBar('Upload successful', 'Close');
        }
      });
    }
  }

  onClick() {
    if (this.fileUpload) {
      this.fileUpload.nativeElement.click();
    }
  }

  deleteEvent(index: number) {
    if (index > -1 && index < this.files.length) {
      this.files.splice(index, 1);
    }
    console.log('Files after deletion:', this.files);
    this.flag = this.files.length > 0;
  }
}


 

