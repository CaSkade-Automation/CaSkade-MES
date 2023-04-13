import { Controller, Body, Post } from "@nestjs/common";
import { SkillExecutorFactory } from "./skill-executor-factory.service";
import { SkillExecutionRequestDto } from "@shared/models/skill/SkillExecutionRequest";

@Controller('skill-executions')
export class SkillExecutionController{

    constructor(private executorFactory: SkillExecutorFactory) {}

    // TODO: Check that skill is in the right state to execute the requested command
    //      --> Send 400 if not
    // TODO: Currently, every skill is directly executed. There could be some kind of scheduler that allows
    //      to add skills for later execution. In this case, this method could be used for adding and a scheduler
    //      could be added to execute the skill
    @Post()
    async addNewSkillExecution(@Body() executionRequest: SkillExecutionRequestDto): Promise<unknown>{
        const skillExecutor = await this.executorFactory.getSkillExecutor(executionRequest.skillIri);

        // Invoke a transition in case a stateful method (i.e. a method connected to the state machine) should be executed
        if(skillExecutor.isStatefulMethod(executionRequest)) return skillExecutor.invokeTransition(executionRequest);

        // Get skill outputs in case GetOutputs method is called
        if (executionRequest.commandTypeIri == "http://www.w3id.org/hsu-aut/cask#GetOutputs") {
            return skillExecutor.getSkillOutputs(executionRequest);
        }

    }

}
