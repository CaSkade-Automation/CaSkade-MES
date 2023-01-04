import { Component } from '@angular/core';
import { ChartData } from 'chart.js';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()]
})
export class ChartsComponent {

    constructor() {}

    public pieChartData: ChartData<'pie', number[], string | string[]> = {
        labels: [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'],
        datasets: [{
            data: [300, 500, 100]
        }]
    };

}
