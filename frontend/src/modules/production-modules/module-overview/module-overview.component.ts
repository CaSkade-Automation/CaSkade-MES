import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModuleService } from '../../../shared/services/module.service';
import { Command } from '@shared/models/state-machine/Command';
import { Observable, Subscription, tap } from 'rxjs';
import { ProductionModule } from '../../../shared/models/ProductionModule';
import { MessageService } from '../../../shared/services/message.service';

@Component({
    selector: 'app-module-overview',
    templateUrl: './module-overview.component.html',

})
export class ModuleOverviewComponent implements OnInit {

    constructor(
        private moduleService: ModuleService,
        private messageService: MessageService
    ) { }

    // Observable to all modules that is always updated through sockets and subscribed to using the async pipe
    modules$: Observable<ProductionModule[]>;


    ngOnInit(): void {
        this.modules$ = this.moduleService.getModules();
    }

    /**
     * Load initial modules on ngOnInit or on refresh
     */
    reloadModules(): void {
        this.moduleService.reloadModules();
    }

    /**
     * React on click event of delete capability button
     * @param capabilityIri
     * @param module
     */
    onCapabilityDeleted(capabilityIri: string, module: ProductionModule): void {
        // find module with that capability and remove it from the view
        const capabilityIndex = module.capabilities.findIndex(capability => capability.iri == capabilityIri);
        module.capabilities.splice(capabilityIndex, 1);
    }


    /**
     * Delete a module with a given IRI and display a message
     * @param moduleIri IRI of the module to delete
     */
    deleteModule(moduleIri: string): void {
        this.moduleService.deleteModule(moduleIri).subscribe({
            error: (err) => {this.messageService.danger("Module could not be deleted", `Module could not be deleted, error: ${err}`);},
        });
    }

}
