import { Component, OnInit } from '@angular/core';
import { GraphDbRepoService } from '../../../shared/services/GraphDbRepoService.service'
import { Observable } from 'rxjs';


@Component({
    selector: 'graphdb-settings',
    templateUrl: './graphdb-settings.component.html',
})

export class GraphDbSettingsComponent implements OnInit{
    repositories: Observable<any>;

    dbObject = {
        host: '139.11.207.25:7200',
        user: 'ops',
        password: 'ops'
    }

    currentRepoTitle: Observable<string>;

    constructor(private repoService: GraphDbRepoService) {}

    ngOnInit() {
        this.currentRepoTitle = this.repoService.getCurrentRepository();
        this.repositories = this.repoService.getRepositories();
    }
    
    changeHost(){
        this.repoService.changeHost(this.dbObject).subscribe(data =>
            this.repositories = this.repoService.getRepositories()
        );
    }

    changeRepository(newRepoTitle) {
        this.repoService.changeRepository(newRepoTitle).subscribe();
        this.currentRepoTitle = this.repoService.getCurrentRepository();
    }
}