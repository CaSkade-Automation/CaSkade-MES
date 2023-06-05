import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { MtpMappingService } from 'src/shared/services/mtp-mapping.service';
import { MessageService } from '../../../services/message.service';

@Component({
    selector: 'mtp-mapping',
    templateUrl: './mtp-mapping.component.html',
    styleUrls: ['./mtp-mapping.component.scss']
})
export class MtpMappingComponent {

    @Input("context") context:  "skills" | "production-modules" | "capabilities";
    addedFile: File;

    constructor(private mtpMappingService: MtpMappingService, private messageService: MessageService) { }

    onFileAdded(event): void{
        this.addedFile=event.target.files[0];
    }

    submit(): void {
        console.log("executing");

        // TODO: Process res (if error -> Use message component to display it)
        this.mtpMappingService.executeMapping(this.addedFile, this.context).pipe(take(1)).subscribe({
            next: (res) => this.messageService
                .success("MTP-Mapping successful", `A module with all its skills was added after mapping MTP file ${this.addedFile.name}"`),
            error: (err) => this.messageService
                .warn("Mapping Error", `Error while mapping MTP file "${this.addedFile.name}"`)
        });
    }
}
