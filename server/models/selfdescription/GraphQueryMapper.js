var groupBy = require('json-groupby')
var _ = require('lodash');

// Maps the query result of "select_allModules" to an array of Modules
module.exports = class GraphQueryMapper {
    mapResultToModule(queryResult) {
        
        let bindings = queryResult.results.bindings;

        let newBindings = this.regroupResults(bindings, [
            {
                object: 'module',
                name: 'name',
                childRoot: 'processes'
            },
            {
                object: 'process',
                name: 'name',
                childRoot: 'methods'
            },
            {
                object: 'method',
                toCollect: ['resourcesBase', 'resourcePath', 'methodType'],
                name: 'name',
                childRoot: 'parameters'
            },
            {
                object: 'param',
                name: 'fullName',
                toCollect: ['paramDataType', 'paramName', 'paramType'],
                childRoot: 'paramOptions'
            },
            {
                object: 'paramOption',
                name: 'name',
                childRoot: 'options'
            }
        ]);
        
        return newBindings;
    };

    
    /** Groups a SPARQL query result and converts it from a tabular structure to a regular nested array of elements  
     * @param inputArray The 'raw' SPARQL result that needs to be converted
     * @returns The converted structure
    */
    regroupResults(inputArray, toGroupBy, currElement=0){

        // first: transform array
        if (currElement == 0 ) {
            inputArray = this.transformArray(inputArray);
        }
        
        
        // get currrent element and fix child root
        let currGroup = toGroupBy[currElement]
        currGroup.childRoot = typeof currGroup.childRoot === "undefined" ? "content" : currGroup.childRoot;

        
        

        // group the ungrouped inputArray
        let groupedArray = groupBy(inputArray, [currGroup.object]);
        
        // Empty the input array, it will later be filled with the grouped content
        inputArray = [];
        
        Object.keys(groupedArray).forEach(key => {
            let groupedElement = groupedArray[key];
           

            // Get all elements that should be collected
            // TODO: Not only take groupedElement[0], but make sure the properties to collect are really equal for all groupedElements
            let elemsToCollect = {};
            if (currGroup.hasOwnProperty("toCollect")) {
                currGroup.toCollect.forEach(elemToCollect => {
                    elemsToCollect[elemToCollect] = groupedElement[0][elemToCollect];   
                    groupedElement.forEach(inputElem => {
                        delete inputElem[elemToCollect];
                    })
                });
            }


            if ((currElement <= (toGroupBy.length-2)) && (this.allEntriesContainGroupingProperty(groupedElement, toGroupBy[currElement+1].object))) {
                groupedElement = (this.regroupResults(groupedElement, toGroupBy, currElement+1));
            }

           
            

            // Delete the all elements that have already been grouped
            groupedElement.forEach(element => {
                toGroupBy.forEach(group => {
                    delete element[group.object];
                })
            });


            

            
            let nameToPush = {
                [currGroup.name] : key,
            }

            let objToPush;
            if (!_.isEmpty(groupedElement[0])) {
                let groupToPush = {[currGroup.childRoot] : groupedElement}
                objToPush = {...nameToPush, ...elemsToCollect, ...groupToPush};
            } else {
                objToPush = {...nameToPush, ...elemsToCollect};
            }  


            // Add the grouped element to the inputArray
            inputArray.push(objToPush);
           
        });
        
        return inputArray;
    }


    allEntriesContainGroupingProperty(arrayToCheck, groupingProperty) {
        for (let i = 0; i < arrayToCheck.length; i++) {
            const element = arrayToCheck[i];
            if (!element.hasOwnProperty(groupingProperty)){
                return false;
            }
        }
        return true;
    }

    transformArray(inputArray) {
        inputArray.forEach(inputElem => {
            Object.keys(inputElem).map(inputElemKey =>{
                return inputElem[inputElemKey] = inputElem[inputElemKey].value
            })
        });
        return inputArray;
    } 
}


class ManufacturingModule{
    constructor(iri) {
        this.iri = iri;
        this.name = iri.split('#',2)[1];
    }

    addProcess(){
        this.processes.push(new Process)
    }
}


class Process{
    constructor(iri) {
        this.iri = iri;
        this.name = iri.split('#',2)[1];
    }



}