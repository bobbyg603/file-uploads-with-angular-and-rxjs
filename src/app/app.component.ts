import { HttpClient, HttpEvent, HttpEventType, HttpUploadProgressEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgxFileDropEntry } from '@bugsplat/ngx-file-drop';
import { BehaviorSubject, bindCallback, filter, finalize, from, map, mergeMap, Observable, scan, switchMap, takeWhile } from 'rxjs';
import { FilesTableEntry } from './files/files-table-entry';
import { FileUploadProgress } from './uploads/file-upload-progress';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  files$?: Observable<FilesTableEntry[]>;
  uploads$?: Observable<FileUploadProgress[]>;

  private getFilesSubject = new BehaviorSubject<any>(null);

  constructor(private httpClient: HttpClient) {
    this.files$ = this.getFilesSubject.asObservable()
      .pipe(
        switchMap(() => this.httpClient.get<FilesTableEntry[]>('http://localhost:8080/files'))
      );
  }

  onFilesDropped(files: NgxFileDropEntry[]): void {
    this.uploads$ = from(files)
      .pipe(
        mergeMap(selectedFile => {
          const id = (Math.random() + 1).toString(36).substring(2);
          const fileEntry = selectedFile.fileEntry as FileSystemFileEntry;
          const observableFactory = bindCallback(fileEntry.file) as any;
          const file$ = observableFactory.call(fileEntry) as Observable<File>;
          return file$
            .pipe(
              switchMap(file => this.uploadFile(file)
                .pipe(
                  takeWhile(event => event.type !== HttpEventType.Response),
                  filter(isHttpProgressEvent),
                  map(event => {
                    const name = file.name;
                    const loaded = event.loaded ?? 0;
                    const total = event.total ?? 1;
                    const progress = Math.round(loaded / total * 100);
                    const failed = false;
                    const done = progress === 100;
                    return {
                      id,
                      name,
                      progress,
                      failed,
                      done
                    };
                  }),
                )
              )
            );
        }),
        scan((acc, next) => {
          acc[next.id] = next;
          return {
            ...acc
          };
        }, {} as Record<string, FileUploadProgress>),
        map(progress => Object.values(progress)),
        finalize(() => this.getFilesSubject.next(null))
      );
  }

  private uploadFile(file: File): Observable<HttpEvent<unknown>> {
    const url = 'http://localhost:8080/upload';
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.httpClient.post(
      url,
      formData,
      {
        reportProgress: true,
        observe: 'events'
      }
    );
  }
}

function isHttpProgressEvent(input: HttpEvent<any>): input is HttpUploadProgressEvent {
  return input.type === HttpEventType.UploadProgress;
}