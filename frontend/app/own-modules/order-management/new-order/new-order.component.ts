import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
})
export class NewOrderComponent{
  selectedFiles=new Array<File>();

  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) { }

  onFilesSelected(event) {
    // add the selected files to the list of files to upload
    for (let i = 0; i < event.target.files.length; i++) {
       this.selectedFiles.push(event.target.files[i]);
    }
  }

  onSubmit(){
    const fd = new FormData();
    this.selectedFiles.forEach(file => {
      fd.append('part', file, file.name);
    });
    this.httpClient.post('/api/order-management/upload', fd)
      .subscribe(res => {       
        this.router.navigate(['../upload-summary'], {relativeTo: this.route})
    })
  }

  deleteFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

}
