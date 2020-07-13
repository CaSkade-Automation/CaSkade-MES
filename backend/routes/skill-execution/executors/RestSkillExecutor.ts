import { SkillExecutor } from '../SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import axios, { AxiosRequestConfig } from 'axios';
import { SkillParameter } from '../../../../shared/models/skill/SkillParameter';
import { GraphDbConnectionService } from 'util/GraphDbConnection.service';

export class RestSkillExecutionService implements SkillExecutor {


    constructor(private graphDbConnection: GraphDbConnectionService) {}

    executeSkill(executionRequest: SkillExecutionRequestDto): void {
        // // throw new Error("Method not implemented.");

        // // // get the full REST service description
        // const serviceDescription = this.getRestServiceDescription();

        // // const queryParams = [];
        // // serviceDescription.parameters.filter(parameter => {
        // //     if((parameter.location == "other") && (parameter.type == "QueryParameter")) {
        // //         queryParams.push(parameter);
        // //     }
        // // });


        // // Create a simple json object for all body parameters
        // const requestBody = {};
        // serviceDescription.parameters.filter(parameter => {
        //     if(parameter.location == "body") {
        //         requestBody[parameter.name] = parameter.value;
        //     }
        // });

        // // Execute the service request
        // const config: AxiosRequestConfig = {
        //     headers: {'content-type' : 'application/json'},
        //     url:
        // }

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


    private getRestServiceDescription(skillIri: string, commandIri: string): RestServiceDescription {
        const query = `
            SELECT ?httpMethod ?path ?basePath ?parameters WHERE {
                <${skillIri}> a Cap:RestSkill.
                <${commandIri}> a ISA88:Transition;
                    Cap:invokedBy ?skillMethod.
                ?skillMethod sesame:directSubClassOf WADL:Method.
            }
		`;
        return null;
    }

}

interface RestServiceDescription {
   httpMethod: string;
   fullPath: string;
   parameters: SkillParameter[];
}
