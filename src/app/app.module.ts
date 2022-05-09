import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxFileDropModule } from '@bugsplat/ngx-file-drop';
import { AppComponent } from './app.component';
import { FileDrop } from './file-drop/file-drop.component';
import { FilesComponent } from './files/files.component';
import { HttpClientModule } from '@angular/common/http';
import { UploadsComponent } from './uploads/uploads.component';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    FileDrop,
    FilesComponent,
    UploadsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbProgressbarModule,
    NgxFileDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
