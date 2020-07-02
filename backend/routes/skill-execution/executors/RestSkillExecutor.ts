import { SkillExecutor } from '../SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { AxiosStatic } from 'axios';

export class RestSkillExecutionService implements SkillExecutor {

    executeSkill(executionRequest: SkillExecutionRequestDto): void {
        throw new Error("Method not implemented.");

        // // get the full REST service description
        // const serviceDescription = this.getRestServiceDescription();

        // const queryParams = [];
        // serviceDescription.parameters.filter(parameter => {
        //     if((parameter.location == "other") && (parameter.type == "QueryParameter")) {
        //         queryParams.push(parameter);
        //     }
        // });

        // const requestBody = {};
        // serviceDescription.parameters.filter(parameter => {
        //     if(parameter.location == "body") {
        //         requestBody[parameter.name] = parameter.value;
        //     }
        // });

        // // Execute the service request
        // axios({
        //     headers: {'content-type' : 'application/json'},
        //     method: serviceDescription.methodType,
        //     url: serviceDescription.fullPath + createQueryParameterString(queryParams),
        //     data: JSON.stringify(requestBody)
        // })
        //     .then((serviceResponse) => {
        //         res.status(200).json({
        //             "msg": "Service execution added and executed",
        //             "res": serviceResponse.data
        //         });
        //     })
        //     .catch((serviceErr) => {
        //         res.status(500).json({
        //             "msg": "Internal Error while executing the service",
        //             "err": serviceErr
        //         });
        //     });
    }


    private getRestServiceDescription(skillIri: string, commandIri: string) {

    }

}
