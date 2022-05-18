import { Component, ViewChild } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


@Component({
    selector: 'doughnut-chart',
    templateUrl: './doughnut-chart.component.html',
    styleUrls: ['../charts.component.scss'],
})
export class DoughnutChartComponent {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    public doughnutChartLabels: string[] = [
        'Download Sales',
        'In-Store Sales',
        'Mail-Order Sales'
    ];
    public doughnutChartData: ChartData<'doughnut'> = {
        labels: this.doughnutChartLabels,
        datasets: [
            { data: [350, 450, 100] },
            { data: [50, 150, 120] },
            { data: [250, 130, 70] }
        ]
    };
    public doughnutChartType: ChartType = 'doughnut';
}
