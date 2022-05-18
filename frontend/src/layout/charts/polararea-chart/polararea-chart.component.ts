import { Component, ViewChild } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'polararea-chart',
    templateUrl: './polararea-chart.component.html',
    styleUrls: ['../charts.component.scss'],
})
export class PolarAreaChartComponent {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    // PolarArea
    public polarAreaChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
    public polarAreaChartData: ChartData<'polarArea'> = {
        labels: this.polarAreaChartLabels,
        datasets: [{
            data: [300, 500, 100, 40, 120],
            label: 'Series 1'
        }]
    };
    public polarAreaLegend = true;

    public polarAreaChartType: ChartType = 'polarArea';

}
