import { RdfElement } from '../RdfElement';
import { StateMachine } from '../state-machine/StateMachine';
import { Isa88StateMachineBuilder } from '../state-machine/ISA88/ISA88StateMachineBuilder';

export class Skill extends RdfElement{
    public stateMachine: StateMachine;

    constructor(skillDto: SkillDto) {
        super(skillDto.skillIri);
        this.stateMachine = Isa88StateMachineBuilder.buildDefault(skillDto.stateMachineIri, skillDto.currentStateTypeIri);
    }
}

export class SkillDto {
    skillIri: string;
    stateMachineIri: string;
    currentStateTypeIri: string;
}
