import { animate, sequence, state, style, transition, trigger } from "@angular/animations";
import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'loader',
    templateUrl: './loader.component.html',
    animations: [
        trigger('bounce', [
            // state('inital', style({transform: 'translateY(0)'})),
            state('active', style({ transform: 'translateY(0)' })),
            // transition('initial => active', [
            //   animate('500ms cubic-bezier(0,0,0,1)'),
            // ]),
            // transition('active => initial', [
            //   animate('500ms cubic-bezier(1,0,1,1)'),
            // ]),
            transition('* => active', [
                sequence([
                    style({ transform: 'translateY(0)' }),
                    animate(
                        '400ms cubic-bezier(0,0,0,1)',
                        style({ transform: 'translateY(-14px)' })
                    ),
                    animate(
                        '300ms cubic-bezier(1,0,1,1)',
                        style({ transform: 'translateY(0)' })
                    ),
                    animate(
                        '200ms cubic-bezier(0,0,0,1)',
                        style({ transform: 'translateY(-10px)' })
                    ),
                    animate(
                        '150ms cubic-bezier(1,0,1,1)',
                        style({ transform: 'translateY(0)' })
                    ),
                    animate(
                        '100ms cubic-bezier(0,0,0,1)',
                        style({ transform: 'translateY(-5px)' })
                    ),
                    animate(
                        '80ms cubic-bezier(1,0,1,1)',
                        style({ transform: 'translateY(0)' })
                    ),
                ]),
            ]),
        ]),
    ],
})
export class LoaderComponent {

    state = ''
    interval;

    @Input('active') set setActive(value: boolean) {
        console.log(value);

        if (!value) {
            clearInterval(this.interval);
        } else{
            this.interval = setInterval(() => {
                this.state = this.state ? '' : 'active';
            }, 1000);
        }

    }
}

