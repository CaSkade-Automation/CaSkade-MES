import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { routerTransition } from '../../router.animations';
import { CapabilityService } from '../../shared/services/capability.service';
import { ModuleService } from '../../shared/services/module.service';
import { SkillService } from '../../shared/services/skill.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];

    constructor(
        private moduleService: ModuleService,
        private capabilityService: CapabilityService,
        private skillService: SkillService,
    ) {

        this.alerts.push(
            {
                id: 1,
                type: 'success',
                message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
            },
            {
                id: 2,
                type: 'warning',
                message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
            }
        );
    }

    capPieChartHeader = "All Capabilities";
    capPieChartData: ChartData<'pie', number[], string | string[]>;

    modulePieChartHeader = "All Modules"
    modulePieChartData: ChartData<'pie', number[], string | string[]>;

    ngOnInit(): void {
        this.loadModuleData();
        this.loadCapabilityData();
    }

    private loadModuleData(): void {
        this.moduleService.getAllModules().subscribe(modules => {
            this.modulePieChartData = {
                labels: [['Modules']],
                datasets: [{
                    data: [modules.length]
                }]
            };
        });
    }

    private loadCapabilityData(): void {
        this.capabilityService.getAllCapabilities().subscribe(caps => {
            this.capPieChartData = {
                labels: [['Capabilities']],
                datasets: [{
                    data: [caps.length]
                }]
            };
        });
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}
