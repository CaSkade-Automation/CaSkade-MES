abstract class ModuleElement {
    public name: string;

    constructor(name) {this.name = name}

    getShortName(): string {
        return this.getShortProperty(this.name);
    }

    getShortProperty(property): string {
        if(property.indexOf("#") == -1) {
            return property;
        } else {
            return property.split("#")[1];
        }
    }

}


export class ManufacturingModule extends ModuleElement {
    public processes = new Array<Process>();

    constructor(json) {
        super(json.name);
        this.name = json.name;
        if (json.processes) {
            json.processes.forEach(jsonProcess => {
                this.processes.push(new Process(jsonProcess))
            });
        }
    }

    addProcesses(processes: Process[]) {
      // make sure the process doesn't already exist
      const newProcesses = processes.filter(process => {
        return !this.processExists(process.name) // -> create a "processExists(name:string)" function
      })
      this.processes.push(...newProcesses);
    }

    /**
     * Compares two modules by their name
     * @param otherModule The module to compare
     */
    equals(otherModule: ManufacturingModule): boolean {
        return (this.name === otherModule.name);
    }

    processExists(name: string): boolean {
      let exists = false;
      this.processes.forEach(process => {
        if(process.name == name) {exists = true}
      });
      console.log(`process name: ${name}`);
      console.log(`exists: ${exists}`);

      return exists;
    }
}

export class Process extends ModuleElement{
    public methods = new Array<Method>();

    constructor(jsonProcess) {
        super(jsonProcess.name)
        this.name = jsonProcess.name;
        if(jsonProcess.methods) {
            jsonProcess.methods.forEach(jsonMethod => {
                this.methods.push(new Method(jsonMethod))
            });
        }
    }
}

// Class that represents a WADL method -> a REST service
export class Method extends ModuleElement {
    public basePath: string;
    public servicePath : string;
    public methodType : string;
    public parameters = new Array<Parameter>();

    constructor(jsonMethod) {
        super(jsonMethod.name)
        this.name = jsonMethod.name;
        this.addBasePath(jsonMethod.resourcesBase);
        this.addServicePath(jsonMethod.resourcePath)
        this.methodType = jsonMethod.methodType;
        if(jsonMethod.parameters) {
            jsonMethod.parameters.forEach(jsonParameter => {
                this.parameters.push(new Parameter(jsonParameter))
            });
        }
    }

    addBasePath(jsonBasePath: string) {
        // Make sure base path doesn't end with a slash
        if(jsonBasePath.endsWith("/")) {
            this.basePath = jsonBasePath.slice(0, jsonBasePath.length - 2);
        } else {
            this.basePath = jsonBasePath;
        }
    }

    addServicePath(jsonServicePath: string) {
        // Make sure service path starts with a slash
        if(!jsonServicePath.startsWith("/")) {
            this.servicePath = "/" + jsonServicePath;
        } else {
            this.servicePath = jsonServicePath;
        }
    }

    getShortMethodType(): string {
        return this.getShortProperty(this.methodType);
    }

    getFullPath(): string {
        return this.basePath + this.servicePath
    }
}

export class Parameter extends ModuleElement {
    public type: string;
    public options: [];
    public dataType: string;
    public location: string;

    constructor(jsonParameter){
        super(jsonParameter.paramName)
        this.type = jsonParameter.paramType;
        this.dataType = jsonParameter.paramDataType;
        this.location = jsonParameter.paramLocation;
        if(jsonParameter.paramOptions) {
            this.options = jsonParameter.paramOptions.map(element => {
                return element.paramOptionValue;
            })
        }
    }

    getShortType(): string {
        return this.getShortProperty(this.type);
    }
}

export class SelectedParameter extends Parameter {
    public value: any;

    constructor(param: Parameter, value:any){
        // TODO: Fix this, currently has to be remapped to query output to use Parameter's constructor
        super({
            "paramName": param.name,
            "paramType": param.getShortType(),
            "paramDataType": param.dataType,
            "paramOptions" : param.options,
            "paramLocation": param.location
        });
        this.value = value;
    }
}


export class ServiceExecutionDescription {
    public fullPath: string;
    public methodType: string;
    public parameters = new Array<SelectedParameter>();

    constructor(fullPath: string, methodType: string, parameters: Array<SelectedParameter>){
        this.fullPath = fullPath;
        this.methodType = methodType;
        this.parameters = parameters;
    }
}




