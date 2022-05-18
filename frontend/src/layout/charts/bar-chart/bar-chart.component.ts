import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from "chartjs-plugin-datalabels";


@Component({
    selector: 'bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['../charts.component.scss'],
})
export class BarChartComponent {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: {
            x: {},
            y: {
                min: 10
            }
        },
        plugins: {
            legend: {
                display: true,
            },
            datalabels: {
                anchor: 'end',
                align: 'end'
            }
        }
    };

    public barChartType: ChartType = 'bar';
    public barChartPlugins = [
        DataLabelsPlugin
    ];

    public barChartData: ChartData<'bar'> = {
        labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
        datasets: [
            { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
            { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
        ]
    };

    public randomize(): void {
        // Only Change 3 values
        this.barChartData.datasets[0].data = [
            Math.round(Math.random() * 100),
            59,
            80,
            Math.round(Math.random() * 100),
            56,
            Math.round(Math.random() * 100),
            40 ];

        this.chart?.update();
    }
}
