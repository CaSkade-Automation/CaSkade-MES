import { Controller, Body, Post } from "@nestjs/common";
import { SkillExecutorFactory } from "./skill-executor-factory.service";

@Controller('skill-execution')
export class SkillExecutionController{

    constructor(private executorFactory: SkillExecutorFactory) {}

    // TODO: Currently, every skill is directly executed. There could be some kind of scheduler that allows
    //      to add skills for later execution. In this case, this method could be used for adding and a scheduler
    //      could be added to execute the skill
    @Post()
    async addNewSkillExecution(@Body() executionRequest: SkillExecutionRequest): Promise<string>{
        const skillExecutor = await this.executorFactory.getSkillExecutor(executionRequest.skillIri);
        skillExecutor.executeSkill(executionRequest);
        return "asd";
    }

}

export class SkillExecutionRequest {
    constructor(public skillIri: string, public transitionIri: string){}
}
