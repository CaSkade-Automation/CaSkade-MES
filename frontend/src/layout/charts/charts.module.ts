import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

import { ChartsRoutingModule } from './charts-routing.module';
import { ChartsComponent } from './charts.component';
import { PageHeaderModule } from '../../shared';
import { RadarChartComponent } from './radar-chart/radar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { PolarAreaChartComponent } from './polararea-chart/polararea-chart.component';

@NgModule({
    imports: [
        CommonModule,
        NgChartsModule,
        ChartsRoutingModule,
        PageHeaderModule
    ],
    declarations: [
        ChartsComponent,
        RadarChartComponent,
        PieChartComponent,
        LineChartComponent,
        DoughnutChartComponent,
        BarChartComponent,
        PolarAreaChartComponent
    ]
})
export class ChartsModule {}
