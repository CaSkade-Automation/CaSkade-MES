import { Component} from '@angular/core';


@Component({
    selector: 'app-skill-processes',
    templateUrl: './skill-processes.component.html',
    styleUrls: ['./skill-processes.component.scss']
})
export class SkillProcessesComponent {
    // diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
    importError?: Error;

    handleImported(event): void {

        const {
            type,
            error,
            warnings
        } = event;

        if (type === 'success') {
            console.log(`Rendered diagram (%s warnings)`, warnings.length);
        }

        if (type === 'error') {
            console.error('Failed to render diagram', error);
        }

        this.importError = error;
    }
}
