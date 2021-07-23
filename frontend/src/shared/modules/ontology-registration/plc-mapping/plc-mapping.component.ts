import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { PlcMappingService } from 'src/shared/services/plc-mapping.service';

@Component({
    selector: 'plc-mapping',
    templateUrl: './plc-mapping.component.html',
    styleUrls: ['./plc-mapping.component.scss']
})
export class PlcMappingComponent implements OnInit {

    addedFile: File;
    endpointUrl: string;
    nodeIdRoot: string;

    constructor(private plcMappingService: PlcMappingService) { }

    ngOnInit() {
    }

    onFileAdded(event){
        this.addedFile=event.target.files[0];
    }

    submit() {
        console.log("submitted mapping");
        console.log(this.endpointUrl);
        console.log(this.nodeIdRoot);

        this.plcMappingService.executeMapping(this.addedFile, this.endpointUrl, this.nodeIdRoot).pipe(take(1)).subscribe(data => console.log(data));
    }

}
