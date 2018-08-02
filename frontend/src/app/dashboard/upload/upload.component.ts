import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../backend.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  fileHoverModeActive = false;
  fileList = [];
  fileUploadJson: any = {};

  constructor(private backendService: BackendService, private authService: AuthService) { }

  ngOnInit() {
  }

  filesHoveredEvent(event: boolean) {
    this.fileHoverModeActive = event;
  }

  filesDroppedEvent(event: FileList) {
    for(let i = 0; i < event.length; i++) {
      this.fileList.push({ name: event[i].name, file: event[i] });
    }
  }

  onRemoveClicked(file) {
    const index = this.fileList.indexOf(file, 0);
    if(index > -1) {
      this.fileList.splice(index, 1);
    }
  }

  onUploadClicked() {
    if(this.fileList.length === 0) {
      alert('Photos must be selected in order to upload!');
      return;
    }

    this.backendService.uploadRequest(this.authService.getToken()).subscribe(res => {
      this.fileUploadJson = {};

      this.fileUploadJson.key = (<any>res).key;
      this.fileUploadJson.user = this.authService.getUsername();
      this.fileUploadJson.files = [];

      for(let i = 0; i < this.fileList.length; i++) {
        const reader = new FileReader();
        reader.onload = this.fileReadLoadHandler.bind(this);
        reader.onload = (evt) => {
          this.fileReadLoadHandler(evt, this.fileList[i].name);
        }
        reader.readAsBinaryString(this.fileList[i].file);
      }
    },
    error => {
      alert('File upload denied!');
    });
  }

  fileReadLoadHandler(event: any, filename: string) {
    const binaryString = event.target.result;
    const fileData = btoa(binaryString);

    this.fileUploadJson.files[this.fileUploadJson.files.length] = { filename: filename, data: fileData};

    // If all files are in binary form in JSON, send to API
    if(this.fileUploadJson.files.length === this.fileList.length) {
      this.backendService.uploadFiles(this.fileUploadJson).subscribe(res => {
        alert('Upload success!');
      },
        error => {
        alert('Upload error!');
        });
    }
  }
}
