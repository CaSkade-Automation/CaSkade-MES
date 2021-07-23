import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { MtpMappingService } from 'src/shared/services/mtp-mapping.service';

@Component({
    selector: 'mtp-mapping',
    templateUrl: './mtp-mapping.component.html',
    styleUrls: ['./mtp-mapping.component.scss']
})
export class MtpMappingComponent {

    addedFile: File;


    constructor(private mtpMappingService: MtpMappingService) { }

    onFileAdded(event){
        this.addedFile=event.target.files[0];
    }

    submit() {

        // TODO: Process res (if error -> Use message component to display it)
        this.mtpMappingService.executeMapping(this.addedFile).pipe(take(1)).subscribe();
    }
}
