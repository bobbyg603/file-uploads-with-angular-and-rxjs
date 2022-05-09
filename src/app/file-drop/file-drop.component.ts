import { Component, EventEmitter, Output } from '@angular/core';
import { NgxFileDropEntry } from '@bugsplat/ngx-file-drop';

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss']
})
export class FileDrop {
  @Output() filesDropped = new EventEmitter<NgxFileDropEntry[]>();

  onFilesDropped(files: NgxFileDropEntry[]) {
    this.filesDropped.next(files);
  }
}
