import { Component, OnInit } from '@angular/core';
import { GraphDbRepoService, DbConfig } from '../../../shared/services/GraphDbRepoService.service'
import { Observable } from 'rxjs';
import { take, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    selector: 'graphdb-settings',
    templateUrl: './graphdb-settings.component.html',
})

export class GraphDbSettingsComponent implements OnInit{
    repositories: String[];

    dbConfig: DbConfig = {
        host: "",
        user: "",
        password: "",
        selectedRepo: "",
    };

    loaderActive = false;
    buttonText = "Change host";
    showWarning = false;

    constructor(private repoService: GraphDbRepoService) {}

    ngOnInit() {
        this.repoService.getCurrentConfig().pipe(take(1)).subscribe(config => {
            this.dbConfig = config;
        });
        this.repoService.getRepositories().pipe(take(1)).subscribe(repos => {
            this.repositories = repos;
        });
    }
    
    changeConfig(){
        this.startLoading();
        this.showWarning = false;
        
        this.repoService.changeConfig(this.dbConfig)
        .subscribe(
            (response:any) => {          
                this.endLoading()
                    this.repoService.getRepositories().pipe(take(1)).subscribe(repos => {
                        this.repositories = repos;
                });
            }, 
            (err:any) => {
                this.endLoading();
                this.showWarning = true;
            }
        );
    }

    changeRepository(newRepoId) {       
        this.repoService.changeRepository(newRepoId).subscribe();
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