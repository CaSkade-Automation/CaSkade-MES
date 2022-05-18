import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from "chartjs-plugin-datalabels";

@Component({
    selector: 'pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['../charts.component.scss'],
})
export class PieChartComponent {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
    public pieChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            datalabels: {
                formatter: (value, ctx) => {
                    if (ctx.chart.data.labels) {
                        return ctx.chart.data.labels[ctx.dataIndex];
                    }
                },
            },
        }
    };
    public pieChartData: ChartData<'pie', number[], string | string[]> = {
        labels: [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'],
        datasets: [{
            data: [300, 500, 100]
        }]
    };
    public pieChartType: ChartType = 'pie';
    public pieChartPlugins = [ DataLabelsPlugin ];

}
