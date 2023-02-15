import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from "chartjs-plugin-datalabels";

@Component({
    selector: 'pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['../charts.component.scss'],
})
export class PieChartComponent {
    public pieChartType: ChartType = 'pie';
    public pieChartPlugins = [ DataLabelsPlugin ];

    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
    public pieChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    textAlign: 'center',
                    font: {
                        size: 10
                    }
                }
            },
        }
    };

    @Input("chartHeader") chartHeader: string;
    @Input("chartData") pieChartData: ChartData<'pie', number[], string | string[]>;
}
