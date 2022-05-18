import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'radar-chart',
    templateUrl: './radar-chart.component.html',
    styleUrls: ['../charts.component.scss'],
})
export class RadarChartComponent {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    // Radar
    public radarChartOptions: ChartConfiguration['options'] = {
        responsive: true,
    };
    public radarChartLabels: string[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

    public radarChartData: ChartData<'radar'> = {
        labels: this.radarChartLabels,
        datasets: [
            { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' },
            { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' }
        ]
    };
    public radarChartType: ChartType = 'radar';


}
