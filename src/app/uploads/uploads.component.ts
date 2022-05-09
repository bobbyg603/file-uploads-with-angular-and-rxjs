import { Component, Input } from '@angular/core';
import { FileUploadProgress } from './file-upload-progress';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent {
  @Input() uploads?: FileUploadProgress[] | null;
}
