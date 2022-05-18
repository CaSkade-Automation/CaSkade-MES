import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import AnnotationsPlugin from "chartjs-plugin-annotation";

Chart.register(AnnotationsPlugin);

@Component({
    selector: 'line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['../charts.component.scss'],
})
export class LineChartComponent {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    public lineChartData: ChartConfiguration['data'] = {
        datasets: [
            {
                data: [65, 59, 80, 81, 56, 55, 40],
                label: 'Series A',
                backgroundColor: 'rgba(148,159,177,0.2)',
                borderColor: 'rgba(148,159,177,1)',
                pointBackgroundColor: 'rgba(148,159,177,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148,159,177,0.8)',
                fill: 'origin',
            },
            {
                data: [28, 48, 40, 19, 86, 27, 90],
                label: 'Series B',
                backgroundColor: 'rgba(77,83,96,0.2)',
                borderColor: 'rgba(77,83,96,1)',
                pointBackgroundColor: 'rgba(77,83,96,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(77,83,96,1)',
                fill: 'origin',
            },
            {
                data: [180, 480, 770, 90, 1000, 270, 400],
                label: 'Series C',
                yAxisID: 'y-axis-1',
                backgroundColor: 'rgba(255,0,0,0.3)',
                borderColor: 'red',
                pointBackgroundColor: 'rgba(148,159,177,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148,159,177,0.8)',
                fill: 'origin',
            }
        ],
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
    };

    public lineChartOptions: ChartConfiguration['options'] = {
        elements: {
            line: {
                tension: 0.5
            }
        },
        scales: {
            // We use this empty structure as a placeholder for dynamic theming.
            x: {},
            'y-axis-0':
            {
                position: 'left',
            },
            'y-axis-1': {
                position: 'right',
                grid: {
                    color: 'rgba(255,0,0,0.3)',
                },
                ticks: {
                    color: 'red'
                }
            }
        },

        plugins: {
            legend: { display: true },
            annotation: {
                annotations: [
                    {
                        type: 'line',
                        scaleID: 'x',
                        value: 'March',
                        borderColor: 'orange',
                        borderWidth: 2,
                        label: {
                            position: 'center',
                            enabled: true,
                            color: 'orange',
                            content: 'LineAnno',
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                ],
            }
        }
    };

    public lineChartType: ChartType = 'line';
    public lineChartPlugins = [ AnnotationsPlugin ];
}
