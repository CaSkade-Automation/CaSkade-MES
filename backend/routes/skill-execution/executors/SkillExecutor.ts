import { SkillExecutionRequestDto } from "@shared/models/skill/SkillExecutionRequest";
import { SkillVariableDto } from "@shared/models/skill/SkillVariable";
import { RdfElement } from "@shared/models/RdfElement";

export abstract class SkillExecutor {

    /**
     * Executes a method on a skill that invokes a transition of the state machine
     * @param executionRequest The request to execute
     */
    abstract invokeTransition(executionRequest: SkillExecutionRequestDto): void;

    /**
     * Execute one of the skill methods that is not connected with the state machine
     * @param executionRequest
     */
    abstract getSkillOutputs(executionRequest: SkillExecutionRequestDto): unknown;

    /**
     * Sets parameters of a skill
     * @param skillIri IRI of the skill to set parameters of
     * @param parameters New parameters that will be set
     */
    abstract setSkillParameters(skillIri: string, parameters: SkillVariableDto[]): void;

    isStatefulMethod(executionRequest: SkillExecutionRequestDto): boolean {
        const commandType = new RdfElement(executionRequest.commandTypeIri);
        if(commandType.getNamespace() == "http://www.hsu-ifa.de/ontologies/ISA-TR88") return true;
        return false;
    }
}
