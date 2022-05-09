import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent {
  @Input() files = [
    {
      url: '#',
      name: 'tiger.png',
      uploaded: new Date(),
      size: 123456789
    }
  ]
}
