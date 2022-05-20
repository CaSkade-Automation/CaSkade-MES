import { Component, OnInit } from '@angular/core';
import { GraphDbRepoService, DbConfig, GraphDbRepositoryInfo } from '../../../shared/services/graphDbRepoService.service';
import { take } from 'rxjs/operators';
import { MessageService } from '../../../shared/services/message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'graphdb-settings',
    templateUrl: './graphdb-settings.component.html',
})
export class GraphDbSettingsComponent implements OnInit{
    repositories: GraphDbRepositoryInfo[];

    dbConfig: DbConfig = {
        host: "",
        user: "",
        password: "",
        selectedRepo: "",
    };

    loaderActive = false;
    buttonText = "Change host";

    constructor(
        private repoService: GraphDbRepoService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.repoService.getCurrentConfig().pipe(take(1)).subscribe(config => {
            this.dbConfig = config;
        });
        this.repoService.getRepositories().pipe(take(1)).subscribe(repos => {
            this.repositories = repos;
        });
    }

    changeConfig(): void{
        this.startLoading();

        this.repoService.changeConfig(this.dbConfig).subscribe({
            next: (config: DbConfig) => {
                this.endLoading();
                this.repoService.getRepositories().pipe(take(1)).subscribe(repos => {
                    this.repositories = repos;
                });
            },
            error: (err: HttpErrorResponse) => {
                this.endLoading();
                this.messageService.danger("Error while setting new configuration", `Could not connect to GraphDB. ${err.error.message}`);
            }
        });
    }

    changeRepository(newRepoId) {
        this.repoService.changeRepository(newRepoId).pipe(take(1)).subscribe(res => console.log(res));
    }

    private startLoading() {
        this.loaderActive = true;
        this.buttonText = "Changing host";
    }

    private endLoading(){
        this.loaderActive = false;
        this.buttonText = "Change host";
    }
}
