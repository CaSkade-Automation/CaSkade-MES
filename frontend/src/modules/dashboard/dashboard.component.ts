import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { combineLatest, combineLatestAll, forkJoin, map, merge, mergeAll, Observable, tap, zip } from 'rxjs';
import { RdfElement } from '../../../../shared/src/models/RdfElement';
import { routerTransition } from '../../router.animations';
import { Capability } from '../../shared/models/Capability';
import { ProductionModule } from '../../shared/models/ProductionModule';
import { Skill } from '../../shared/models/Skill';
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
    ) {}

    modules = new Array<ProductionModule>();
    capabilities = new Array<Capability>();
    skills = new Array<Skill>();

    entityBarChartData: ChartData<'bar', number[], string | string[]>;
    capPieChartData: ChartData<'pie', number[], string | string[]>;
    skillTypeData: ChartData<'pie', number[],  string | string[]>;
    modulePieChartData: ChartData<'pie', number[], string | string[]>;

    ngOnInit(): void {
        this.loadEntityData();
    }

    private loadEntityData(): void {
        const modules$ = this.moduleService.getAllModules();
        const capabilities$ = this.capabilityService.getAllCapabilities();
        const skills$ = this.skillService.getAllSkills();

        zip(modules$, capabilities$, skills$)
            .pipe(
                map(([modules, capabilities, skills]) => ({ modules, capabilities, skills })),
            )
            .subscribe(data => {
                console.log(data);

                this.modules = data.modules,
                this.capabilities = data.capabilities,
                this.skills = data.skills;
                this.entityBarChartData = {
                    labels: ['Modules', 'Capabilities', 'Skills'],
                    datasets: [
                        {
                            data: [this.modules.length, this.capabilities.length, this.skills.length],
                            label: 'Entities', backgroundColor: '#135684'
                        },
                    ]
                };
                this.splitCapabilityData();
                this.splitSkillData();
            });

    }

    private splitCapabilityData(): void {
        const requiredCaps = this.capabilities.filter(cap => cap.capabilityType.getLocalName() == "RequiredCapability");
        const providedCaps = this.capabilities.filter(cap => cap.capabilityType.getLocalName() == "ProvidedCapability");
        this.capPieChartData = {
            labels: [['Required Capability'], ['Provided Capability']],
            datasets: [{
                data: [requiredCaps.length, providedCaps.length],
            }]
        };
    }

    private splitSkillData(): void {
        console.log(this.skills);

        const javaSkills = this.skills.filter(skill => skill.skillType.iri == 'http://www.w3id.org/hsu-aut/caskman#JavaSkill');
        const mtpSkills = this.skills.filter(skill => skill.skillType.iri == 'http://www.w3id.org/hsu-aut/caskman#MtpSkill');
        const plcSkills = this.skills.filter(skill => skill.skillType.iri == 'http://www.w3id.org/hsu-aut/caskman#PlcSkill');
        console.log(javaSkills);

        this.skillTypeData = {
            labels: [['Java'], ['MTP'], ['PLC']],
            datasets: [{
                data: [javaSkills.length, mtpSkills.length, plcSkills.length]
            }]
        };
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}
