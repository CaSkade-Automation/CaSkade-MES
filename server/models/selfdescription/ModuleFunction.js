class ModuleFunction{
    constructor(name, description, location, requestMethod, parameters) {

        console.log('parameters');
        console.log(parameters);
        
        

        this.name = name;
        this.description = description;
        this.location = location;
        this.requestMethod = requestMethod;
        
        this.parameters = new Array();
        parameters.forEach(parameter => {
            this.parameters.push(new Parameter(parameter.name, parameter.dataType))
        });
    }
}
module.exports = ModuleFunction;

class Parameter {
    constructor(name, dataType) {
        this.name = name;
        this.dataType = dataType;
    }
}