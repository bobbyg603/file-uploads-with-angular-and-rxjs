# 📂🚀☁️ File Uploads with Angular and RxJS

[![medium profile link](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/better-programming/file-uploads-with-angular-and-rxjs-34262b3450ae)
[![twitter profile link](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/bobbyg603/status/1524465334522195968)

<img alt="File Uploads With Angular and RxJS" src="https://user-images.githubusercontent.com/2646053/167491922-66cc1460-1a59-4444-ab5c-7fd4d0dce2c9.gif" width="540px" height="auto">

This is is a companion repo for [File Uploads with Angular and RxJS](https://betterprogramming.pub/file-uploads-with-angular-and-rxjs-34262b3450ae) that demonstrates how to build a drag and drop file upload control. Topics in this article include the uploading files with Angular HttpClient, using Bootstrap to display progress bars, and leveraging RxJS observables with subscriptions that complete automatically.

## ☕️ TL;DR

Clone this repo to your workspace:

```sh
git clone https://github.com/bobbyg603/file-uploads-with-angular-and-rxjs
```

Install the dependencies and start the application:

```sh
cd file-uploads-with-angular-and-rxjs && npm i && npm start
```

You will also need to clone the companion Express server:

```sh
git clone https://github.com/bobbyg603/upload-server
```

Install the dependencies and start the server:

```sh
cd upload-server && npm i && npm start
```

Use the drag and drop control or click "Browse Files" to select files to upload:

## 🕵️ Inspecting the Code

This project requires a separate server for testing file uploads. Follow the instructions in the [bobbyg603/upload-server](https://github.com/bobbyg603/upload-server) repo to configure your system for testing file uploads.

> ℹ️ The upload server should only be run on your local system while you're actively testing.

We use Angular's HttpClient to make a GET to our server so that we can display a list of files. The `getFilesSubject` will emit an event that triggers another GET to the server:

[app.component.ts](https://github.com/bobbyg603/file-uploads-with-angular-and-rxjs/blob/c327f1c833d0de4d8b09d5a2a5012b8670b2c2d3/src/app/app.component.ts#L21-L26)
```ts
files$?: Observable<FilesTableEntry[]>;

constructor(private httpClient: HttpClient) {
  this.files$ = this.getFilesSubject.asObservable()
    .pipe(
      switchMap(() => this.httpClient.get<FilesTableEntry[]>('http://localhost:8080/files'))
    );
}
```

The `files$` property is an observable that emits the list of files and is subscribed to in the template via the AsyncPipe:

[app.component.html](https://github.com/bobbyg603/file-uploads-with-angular-and-rxjs/blob/c327f1c833d0de4d8b09d5a2a5012b8670b2c2d3/src/app/app.component.html#L3)
```html
<app-files [files]="files$ | async"></app-files>
```

For file uploads, we start with a drag and drop control in the component template:

[app.component.html](https://github.com/bobbyg603/file-uploads-with-angular-and-rxjs/blob/c327f1c833d0de4d8b09d5a2a5012b8670b2c2d3/src/app/app.component.html#L1)
```html
<app-file-drop class="d-block my-4" (filesDropped)="onFilesDropped($event)"></app-file-drop>
```

We handle the `filesDropped` event in the component code. In the event handler we transform the `NgxFileDropEntry` array into an observable array of type `File`. For each file in the collection we call `uploadFile` and take all of the progress events until we see `HttpEventType.Response` which is the indication that the file has been uploaded successfully. We take all of the events and add them to a collection containing `FileUploadProgress` objects that describe the current upload progress for each of the files. Finally, the function passed to the `finalize` operator gets called and we instruct the `getFilesSubject` to emit so that the table of uploaded files is refreshed:

[app.component.ts](https://github.com/bobbyg603/file-uploads-with-angular-and-rxjs/blob/c327f1c833d0de4d8b09d5a2a5012b8670b2c2d3/src/app/app.component.ts#L28-L70)
```ts
uploads$?: Observable<FileUploadProgress[]>;

onFilesDropped(files: NgxFileDropEntry[]): void {
  this.uploads$ = from(files)
    .pipe(
      mergeMap(selectedFile => {
        const id = uuid();
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
```

The `uploads$` property contains an observable collection of `FileUploadProgress` objects and is in the template to create a progress bar for each of the files being uploaded:

[app.component.html](https://github.com/bobbyg603/file-uploads-with-angular-and-rxjs/blob/c327f1c833d0de4d8b09d5a2a5012b8670b2c2d3/src/app/app.component.html#L2)
```html
<app-uploads [uploads]="uploads$ | async"></app-uploads>
```

## 🧑‍🎓 Further Exploration

Want to use this component in a production scenario? Take a look the [upload-client](https://github.com/bobbyg603/upload-client) repo.

<img alt="Further Exploration Preview" src="https://user-images.githubusercontent.com/2646053/167490042-56670fb6-2779-4b67-8bfd-825a7a4e2a83.gif" width="540px" height="auto">

The upload client repository takes this example and adds a Navbar, a modal, a loading wheel, error handling, and more! Please also subscribe to me on [Medium](bobbyg603.medium.com), follow me on [Twitter](https://twitter.com/bobbyg603), and subscribe to my [YouTube](https://youtube.com/c/bobbyg603) channel if you have a moment.

Thank you for your support ❤️
