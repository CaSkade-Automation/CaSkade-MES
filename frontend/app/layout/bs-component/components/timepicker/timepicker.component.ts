import { Component } from '@angular/core';

@Component({
    selector: 'app-timepicker',
    templateUrl: './timepicker.component.html',
    styleUrls: ['./timepicker.component.scss']
})
export class TimepickerComponent {
    defaultTime = {hour: 13, minute: 30};
    meridianTime = {hour: 13, minute: 30};
    meridian = true;

    seconds = true;

    hourStep = 1;
    minuteStep = 15;
    secondStep = 30;

    toggleSeconds() {
        this.seconds = !this.seconds;
    }

    toggleMeridian() {
        this.meridian = !this.meridian;
    }
}
