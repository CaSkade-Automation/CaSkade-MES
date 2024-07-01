import { Injectable } from '@nestjs/common';

@Injectable()
export class ConstraintService {


    getAllConstraints() {
        // Constraints can be either simple value constraints or open math constraints, need to get both
        const valueConstraintsQuery = `
        `;

        const openMathConstraintQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX OM: <http://openmath.org/vocab/math#>

        SELECT ?parent ?capabilityConstraint (count(?argumentList)-1 as ?position) ?operator ?argName ?argValue ?argType ?arg WHERE {

            ?capabilityConstraint OM:arguments/rdf:rest* ?argumentList;
                OM:operator ?operator.

            ?argumentList rdf:rest*/rdf:first ?arg.
            ?arg a ?argType.
            # ?argType rdfs:subClassOf OM:Object.
            OPTIONAL {
                ?arg OM:name ?argName.
            }
            OPTIONAL {
                ?arg OM:value ?argValue.
            }
        }
        GROUP BY ?capabilityConstraint ?argName ?argValue ?operator ?argType ?arg`;
    }

    getConstraintsOfCapability(capabilityIri: string): Array<string> {
        return [];
    }

}
