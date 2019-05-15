class SelfDescription {
    constructor(id, name, port, moduleFunctions){
        this.header = new Header(id, name, port);
        this.body = new Body(moduleFunctions)
    }
    
    getFunctionByName(name) {
        this.body.moduleFunctions.forEach(moduleFunction => {
            var functionName = moduleFunction.name;
            if(functionName == name) {
                return moduleFunction;
            }
        });
    }
}
module.exports = SelfDescription;

class Header {
    constructor(id, name, port) {
        this.id = id;
        this.name = name;
        this.port = port;
    }
}


var ModuleFunction = require('./ModuleFunction');
class Body {
    constructor(moduleFunctions) {
        this.moduleFunctions = new Array();
        moduleFunctions.forEach(moduleFunction => {
            this.moduleFunctions.push(new ModuleFunction(moduleFunction.name, moduleFunction.description, moduleFunction.location, moduleFunction.requestMethod, moduleFunction.parameters));            
        });
    }
}