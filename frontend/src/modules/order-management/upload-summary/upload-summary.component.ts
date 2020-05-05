import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'upload-summary',
  templateUrl: 'upload-summary.component.html',
})
export class UploadSummaryComponent {
  // dummy files for testing, they need to be fetched from the server's file system
  files = [{
            "name": "part1",
            "size": "120 kB",
            "checked": true,
            "rowSelected": false
          },
          {
            "name": "part2",
            "size": "2722 kB",
            "checked": true,
            "rowSelected": false
          }];

  selectedFile = null;

  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) {}


  private selectRow(i: number) {
    
    // delete all selections
    this.files.forEach(file => {
      file.rowSelected = false;
    });
    
    this.selectedFile = this.files[i];
    // select one to change styling
    this.files[i].rowSelected = true;
  }

  nextTab(){
    this.router.navigate(['../producibility-check'], {relativeTo: this.route})
  }
  

}
