import { Isa88StateMachine } from "./ISA88StateMachine";
import { Isa88StateTypeIri } from "./ISA88StateTypeIri";
import { Isa88CommandTypeIri } from "./ISA88CommandTypeIri";
import { Transition } from "../Transition";
import { State } from "../State";

export class Isa88StateMachineBuilder {

    static commandTypes = new Map<Isa88CommandTypeIri, Transition>();
    static states = new Map<Isa88StateTypeIri, State> ();

    static buildDefault(stateMachineIri: string, currentStateTypeIri: string): Isa88StateMachine {
        const stateMachine = new Isa88StateMachine(stateMachineIri);

        Object.values(Isa88CommandTypeIri).forEach(commandName => {
            this.commandTypes.set(commandName, new Transition(commandName));
        });
        stateMachine.setCommands(Array.from(this.commandTypes.values()));


        Object.values(Isa88StateTypeIri).forEach(stateTypeIri => {
            const outgoingCommands = Isa88StateMachineBuilder.setActiveCommandsOfState(stateTypeIri);
            this.states.set(stateTypeIri, new State(stateTypeIri, outgoingCommands));
        });
        stateMachine.setStates(Array.from(this.states.values()));

        stateMachine.setCurrentState(currentStateTypeIri);

        return stateMachine;
    }

    static setActiveCommandsOfState(stateName: Isa88StateTypeIri): Transition[] {
        switch (stateName) {
        case Isa88StateTypeIri.Idle:
            return [this.commandTypes.get(Isa88CommandTypeIri.Start), this.commandTypes.get(Isa88CommandTypeIri.Stop), this.commandTypes.get(Isa88CommandTypeIri.Abort)];
        case Isa88StateTypeIri.Execute:
            return [this.commandTypes.get(Isa88CommandTypeIri.Hold), this.commandTypes.get(Isa88CommandTypeIri.Suspend), this.commandTypes.get(Isa88CommandTypeIri.Stop), this.commandTypes.get(Isa88CommandTypeIri.Abort)];
        case Isa88StateTypeIri.Held:
            return [this.commandTypes.get(Isa88CommandTypeIri.Unhold), this.commandTypes.get(Isa88CommandTypeIri.Stop), this.commandTypes.get(Isa88CommandTypeIri.Abort)];
        case Isa88StateTypeIri.Suspended:
            return [this.commandTypes.get(Isa88CommandTypeIri.Unsuspend), this.commandTypes.get(Isa88CommandTypeIri.Stop), this.commandTypes.get(Isa88CommandTypeIri.Abort)];
        case Isa88StateTypeIri.Complete:
            return [this.commandTypes.get(Isa88CommandTypeIri.Reset), this.commandTypes.get(Isa88CommandTypeIri.Stop), this.commandTypes.get(Isa88CommandTypeIri.Abort)];
        case Isa88StateTypeIri.Starting, Isa88StateTypeIri.Completing, Isa88StateTypeIri.Holding, Isa88StateTypeIri.Unholding, Isa88StateTypeIri.Suspending, Isa88StateTypeIri.Unsuspending, Isa88StateTypeIri.Resetting:
            return [this.commandTypes.get(Isa88CommandTypeIri.Stop), this.commandTypes.get(Isa88CommandTypeIri.Abort)];
        case Isa88StateTypeIri.Aborted:
            return [this.commandTypes.get(Isa88CommandTypeIri.Clear)];
        case Isa88StateTypeIri.Clearing, Isa88StateTypeIri.Stopping:
            return [this.commandTypes.get(Isa88CommandTypeIri.Abort)];
        case Isa88StateTypeIri.Stopped:
            return [this.commandTypes.get(Isa88CommandTypeIri.Reset), this.commandTypes.get(Isa88CommandTypeIri.Abort)];
        default:
            return [];
        }
    }


    static getStateByIri(stateIri: string): State{
        console.log(`trying to find: ${stateIri}`);

        for (const state of this.states) {
            if(state[0] === stateIri) {
                console.log("found, returning ");
                console.log(state[1]);

                return state[1];
            }
        }

        // In case no match is found: Return null
        return null;
    }
}
