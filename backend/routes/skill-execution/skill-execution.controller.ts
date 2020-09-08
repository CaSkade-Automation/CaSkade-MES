import { Controller, Body, Post } from "@nestjs/common";
import { SkillExecutorFactory } from "./skill-executor-factory.service";
import { SkillExecutionRequestDto } from "@shared/models/skill/SkillExecutionRequest";

@Controller('skill-executions')
export class SkillExecutionController{

    constructor(private executorFactory: SkillExecutorFactory) {}

    @Post()
    async addNewSkillExecution(@Body() executionRequest: SkillExecutionRequestDto): Promise<unknown>{
        const skillExecutor = await this.executorFactory.getSkillExecutor(executionRequest.skillIri);

        // Invoke a transition in case a stateful method (i.e. a method connected to the state machine) should be executed
        if(skillExecutor.isStatefulMethod(executionRequest)) return skillExecutor.invokeTransition(executionRequest);

        // Get skill outputs in case GetOutputs method is called
        if (executionRequest.commandTypeIri == "http://www.hsu-ifa.de/ontologies/capability-model#GetOutputs") {
            return skillExecutor.getSkillOutputs(executionRequest);
        }

    }

}
