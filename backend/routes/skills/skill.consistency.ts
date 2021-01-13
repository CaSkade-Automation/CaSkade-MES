import { Injectable, BadRequestException } from '@nestjs/common';
import { GraphDbConfig, GraphDbConnectionService } from '../../util/GraphDbConnection.service';
import * as fs from 'fs';

const factory = require('rdf-ext');
const ParserN3 = require('@rdfjs/parser-n3');
const SHACLValidator = require('rdf-validate-shacl');

@Injectable()
export class SkillConsistency {
    constructor(
        private graphDbConnection: GraphDbConnectionService) { }

    private data: any;

    async loadDataSet(filePath: string): Promise<void> {
        const stream = fs.createReadStream(filePath);
        const parser = new ParserN3({ factory });
        return factory.dataset().import(parser.import(stream));
    }

    async variableTypeEqualWithDefaultValue() {
        const query = `
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            SELECT ?skillparam ?value ?type
            WHERE {
                ?skillparam a Cap:SkillParameter;
                    Cap:hasDefaultValue ?value;
                    Cap:hasVariableType ?type. 
                    FILTER ( datatype(?value) != ?type )
            }`;

        const queryResult = await this.graphDbConnection.executeQuery(query);
        return queryResult.results.bindings;
    }

    async variableTypeEqualWithParamOption() {
        const query = `
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            SELECT ?skillparamopt ?value ?type
            WHERE {
                ?skillparamopt a Cap:SkillVariableOption;
                    Cap:hasOptionValue ?value;
                    ^Cap:hasSkillVariableOption ?param.
                    ?param Cap:hasVariableType ?type.  
                    FILTER ( datatype(?value) != ?type )
            }`;

        const queryResult = await this.graphDbConnection.executeQuery(query);
        return queryResult.results.bindings;
    }

    async sameNodeId() {
        const query = ` 
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
            SELECT DISTINCT  ?subject ?subject2 ?object
            WHERE { 
                ?subject OpcUa:nodeId ?object.  
                ?subject2 OpcUa:nodeId ?object.
                FILTER(?subject != ?subject2)
        }`;

        const queryResult = await this.graphDbConnection.executeQuery(query);
        return queryResult.results.bindings;
    }

    async validateSkill(skillGraphName: string) {

        const shape = await this.loadDataSet('rules_skill.ttl');

        const newData = await this.graphDbConnection.getStatements("");
        fs.writeFileSync('data.ttl', newData);

        this.data = await this.loadDataSet('data.ttl');
        const validator = new SHACLValidator(shape, { factory });
        const report = await validator.validate(this.data);
        this.logReport(report);

        if (!report.conforms) {
            await this.graphDbConnection.clearGraph("urn:" + skillGraphName);
            return report.results;
        }
        const bindingsDefaultValue = await this.variableTypeEqualWithDefaultValue();
        if (bindingsDefaultValue.length > 0) {
            await this.graphDbConnection.clearGraph("urn:" + skillGraphName);
            return bindingsDefaultValue;
        }
        const bindingsOptionValue = await this.variableTypeEqualWithParamOption(); 
        if (bindingsOptionValue.length > 0) {
            await this.graphDbConnection.clearGraph("urn:" + skillGraphName);
            return bindingsOptionValue;
        }
        return "";
    }

    async getSkillType(newSkill: string): Promise<string> {
        const n = newSkill.search("OpcUaMethodSkill");
        if (n != -1)
            return "OpcUaSkill";
        const i = newSkill.search("RestSkill");
        if (i != -1)
            return "RestSkill";
        return "";
    }

    async validateOpcUaSkill(skillGraphName: string) {

        const shape = await this.loadDataSet("rules_opcuaSkill.ttl");

        const validator = new SHACLValidator(shape, { factory });
        const report = await validator.validate(this.data);
        this.logReport(report);

        if (!report.conforms) {
            await this.graphDbConnection.clearGraph("urn:" + skillGraphName);
            return report.results; 
        }
        const bindings = await this.sameNodeId(); 
        if (bindings.length > 0) {
            await this.graphDbConnection.clearGraph("urn:" + skillGraphName);
            return bindings;
        }
        return "";
    }

    logReport(report: any) {
        // Check conformance: `true` or `false`
        console.log(report.conforms);

        for (const result of report.results) {
            // See https://www.w3.org/TR/shacl/#results-validation-result for details
            // about each property
            console.log(result.message);
            console.log(result.path);
            console.log(result.focusNode);
            console.log(result.severity);
            console.log(result.sourceConstraintComponent);
            console.log(result.sourceShape);
        }

        // Validation report as RDF dataset
        console.log(report.dataset);
    }
}