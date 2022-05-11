import { Component, Input } from '@angular/core';
import { FilesTableEntry } from './files-table-entry';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent {
  @Input() files: FilesTableEntry[] | null = [
    {
      url: '#',
      name: 'tiger.png',
      uploaded: new Date(),
      size: 123456789
    }
  ];
}