import { SkillExecutionRequestDto } from "@shared/models/skill/SkillExecutionRequest";
import { RdfElement } from "@shared/models/RdfElement";
import { SkillVariable } from "../../../../shared/models/skill/SkillVariable";

export abstract class SkillExecutor {

    /**
     * Executes a method on a skill that invokes a transition of the state machine
     * @param executionRequest The request to execute
     */
    abstract invokeTransition(executionRequest: SkillExecutionRequestDto): void;

    /**
     * Get all outputs (e.g. by reading the variables or executing a method returning the outputs)
     * @param executionRequest
     */
    abstract getSkillOutputs(executionRequest?: SkillExecutionRequestDto): unknown;

    /**
     * Sets parameters of a skill
     * @param skillIri IRI of the skill to set parameters of
     * @param parameters New parameters that will be set
     */
    abstract setSkillParameters(executionRequest: SkillExecutionRequestDto): void;

    isStatefulMethod(executionRequest: SkillExecutionRequestDto): boolean {
        const commandType = new RdfElement(executionRequest.commandTypeIri);
        if(commandType.getNamespace() == "http://www.hsu-ifa.de/ontologies/ISA-TR88") return true;
        return false;
    }

    findMatchingParameters(executionParameters: SkillVariable[], describedParameters: SkillVariable[]): SkillVariable[] {
        const matchedParameters = new Array<SkillVariable>();

        // check if all execution parameters are contained in the ontology description
        describedParameters.forEach(descParam => {
            const foundParam = executionParameters.find(execParam => descParam.name == execParam.name);
            if(descParam.required && !foundParam ){
                throw new Error(`The parameter '${descParam.name}' is required but was not found in the execution`);
            }
            else {
                matchedParameters.push(foundParam);
            }
        });

        // Check that all sent parameters exist in the ontology
        executionParameters.forEach(execParam => {
            if(!describedParameters.find(descParam => descParam.name == execParam.name)) {
                throw new Error(`The entered parameter '${execParam.name}' was not found in the ontology`);
            }
        });

        return matchedParameters;
    }
}
