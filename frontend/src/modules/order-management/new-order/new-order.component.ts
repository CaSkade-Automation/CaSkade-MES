import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder,  FormArray } from '@angular/forms';
import { OrderQueryService } from '../order-query-service';


@Component({
    selector: 'app-new-order',
    templateUrl: './new-order.component.html',
})
export class NewOrderComponent implements OnInit {

  // TODO: Get real properties from the graph db
  restrictionProperties: string[] = ["Material", "Tolerance"];

  processes: string[];

  selectedFiles=new Array<File>();
  logicInterpretations = ["<", "<=", "=", "=>", ">"];

  orderInquiryForm = this.fb.group({
      name: [''],
      company : [''],
      eMail: [''],
      selectedRestrictions: this.fb.array([
          this.fb.group({
              propertyType: [''],
              logicInterpretation: [''],
              value: ['']
          })
      ])
  })


  constructor(private fb: FormBuilder, private orderQueryService: OrderQueryService) { }

  ngOnInit() {
      this.orderQueryService.getAllManufacturingProcesses().subscribe(data => {
          this.processes = data;
      });
  }


  onFilesSelected(event) {
      // add the selected files to the list of files to upload
      for (let i = 0; i < event.target.files.length; i++) {
          this.selectedFiles.push(event.target.files[i]);
      }
  }

  onSubmit(){



      // const fd = new FormData();
      // this.selectedFiles.forEach(file => {
      //   fd.append('part', file, file.name);
      // });
      // this.httpClient.post('/api/order-management/upload', fd)
      //   .subscribe(res => {
      //     this.router.navigate(['../upload-summary'], {relativeTo: this.route})
      // })
  }

  deleteFile(index: number) {
      this.selectedFiles.splice(index, 1);
  }


  get selectedRestrictions() {
      return this.orderInquiryForm.get('selectedRestrictions') as FormArray;
  }

  addRestriction(){
      this.selectedRestrictions.push(
          this.fb.group({
              propertyType: [''],
              logicInterpretation: [''],
              value: ['']
          })
      );
  }

  removeRestriction(i: number) {
      this.selectedRestrictions.removeAt(i);
  }

}


