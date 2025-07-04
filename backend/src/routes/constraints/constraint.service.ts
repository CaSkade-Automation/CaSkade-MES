import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GraphDbConnectionService } from '../../util/GraphDbConnection.service';
import { SparqlResultConverter } from 'sparql-result-converter';
import { FormulaConstraintDto, ValueConstraintDto } from '@shared/models/constraints/ConstraintDto';
import { constraintMapping } from './constraint-mappings';
import { getValueConstraintQuery } from './constraint-queries';
import { OmRdfParser } from "openmath-rdf-parser";

const converter = new SparqlResultConverter();
const oMRdfParser = new OmRdfParser();

@Injectable()
export class ConstraintService {


    constructor(
        readonly graphDbConnection: GraphDbConnectionService
    ) {}


    async getConstraints(capabilityIri = '?cap') {
        const constraints = new Array<ValueConstraintDto | FormulaConstraintDto>();

        // Get all value constraints
        try {
            const valueConstraintsQuery = getValueConstraintQuery(capabilityIri);
            const vCQueryResult = await this.graphDbConnection.executeQuery(valueConstraintsQuery);
            const partialValueConstraints = converter
                .convertToDefinition(vCQueryResult.results.bindings, constraintMapping)
                .getFirstRootElement() as Array<Partial<ValueConstraintDto>>;

            const valueConstraints = partialValueConstraints
                .map(pC => new ValueConstraintDto(
                    pC.capabilityIri, pC.dataElement, pC.instanceDescription, pC.expressionGoal, pC.logicInterpretation, pC.value)
                );
            constraints.push(...valueConstraints);
        } catch (error) {
            console.log("Error while getting value constraint");
            throw new InternalServerErrorException(error, "Error while getting value constraint");
        }

        // TODO: Formula constraints are currently handled in too complicated way. We need to get export a capability's RDF, send it to the OpenMath parser
        // The parser loads it, queries it and parses it into a string. It would be way faster if the parser directly queried the GraphDB.
        // This currently doesn't work because of a bug in Comunica (https://github.com/comunica/comunica/issues/1391). Will be changed if the bug
        // is fixed on Comunica's side
        try {
            // We need to mention explicit capability classes here since just looking for CSS:Cap doesn't work.
            const capabilityDeclaration = `
                <${capabilityIri}> a ?capClass.
                VALUES ?capClass {CSS:Capability CaSk:ProvidedCapability CaSk:RequiredCapability }
            `;
            const graphIris = await this.graphDbConnection.getGraphsContainingStatements(capabilityDeclaration);
            // There should only be one graph containing the capability definition
            const capabilityRdfData = await this.graphDbConnection.exportStatementsInGraph(graphIris[0]);

            const formulaConstraints = await oMRdfParser.allFromOpenMath(capabilityRdfData);
            const formulaConstraintDtos = formulaConstraints
                .map(formulaConstraint => new FormulaConstraintDto(capabilityIri, formulaConstraint.formula));
            constraints.push(...formulaConstraintDtos);
        } catch (error) {
            console.log("Error while getting formula constraint");
            throw new InternalServerErrorException("Error while getting formula constraint", {cause: new Error(error)});
        }
        return constraints;
    }

    async getConstraintsOfCapability(capabilityIri: string): Promise<Array<ValueConstraintDto | FormulaConstraintDto>> {
        const constraints = this.getConstraints(capabilityIri);
        return constraints;
    }

}
