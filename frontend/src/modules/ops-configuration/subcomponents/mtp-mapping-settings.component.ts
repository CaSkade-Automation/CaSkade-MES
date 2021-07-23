import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { MtpMappingService } from 'src/shared/services/mtp-mapping.service';
import {MappingServiceConfig} from '@shared/models/mappings/MappingServiceConfig';

@Component({
    selector: 'mtp-mapping-settings',
    templateUrl: './mtp-mapping-settings.component.html',
})

export class MtpMappingSettingsComponent implements OnInit{

    url = "asd";

    loaderActive = false;
    buttonText = "Change Url";
    showWarning = false;

    constructor(private mtpMappingService: MtpMappingService) {}

    ngOnInit(): void {
        this.mtpMappingService.getConfig().subscribe((config: MappingServiceConfig) => {
            console.log(config);
            console.log(config.url);

            this.url = config.url;});
    }

    changeUrl(): void{
        this.startLoading();
        this.showWarning = false;

        this.mtpMappingService.changeUrl(this.url)
            .subscribe(
                (response: any) => {
                    this.endLoading();
                    this.mtpMappingService.getConfig().pipe(take(1)).subscribe(url => {
                        console.log("all good");

                    });
                },
                (err: any) => {
                    console.log(err);

                    this.endLoading();
                    this.showWarning = true;
                }
            );
    }

    private startLoading() {
        this.loaderActive = true;
        this.buttonText = "Changing URL";
    }

    private endLoading(){
        this.loaderActive = false;
        this.buttonText = "Change URL";
    }
}
