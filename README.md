<h1 align="center">SkillMEx - A Skill-Based Manufacturing Execution Platform</h1>
<div align="center">
    <img width="400px" src="https://github.com/aljoshakoecher/SkillMEx/blob/documentation/images/documentation/images/SkillUp_logo.png?raw=true">
</div>
<hr>

## Table of Contents
1. [Introduction](https://github.com/aljoshakoecher/SkillMEx#Introduction)
2. [Setup & Install](https://github.com/aljoshakoecher/SkillMEx#setup--install)
3. [Using SkillMEx](https://github.com/aljoshakoecher/SkillMEx#using-skillmex)
4. [API Documentation](https://github.com/aljoshakoecher/SkillMEx#api--documentation)
5. [Further Reading](https://github.com/aljoshakoecher/SkillMEx#further--reading)
<hr>

## Introduction
SkillMEx is a manufacturing execution platform that works with manufacturing modules that have a semantic description of their functions in the form of *capabilities* and *skills*. It's powered by this [capability and skill ontology](https://github.com/aljoshakoecher/machine-skill-model).
### Ontologies? Capabilities? Skills? What?
Ontologies are a way to create semantic models
Capabilities represent the processes that a module can perform. Capability might be arbitrary processes or can be specified using 


## Setup & Install
### Requirements
**Node.js**
SkillMEx is built with NestJS & Angular which both rely on Node.js being installed. Make sure to download and install an LTS version of Node. Node.js > v14 is recommended.
**GraphDB**
SkillMEx uses ontologies and stores them in a triple store. We currently work with GraphDB. Make sure to download GraphDB from https://www.ontotext.com/products/graphdb/graphdb-free/ and start it. You then need to create a repository that SkillMEx can use. The connection to a repository can be managed in SkillMEx

### Development setup
After you have installed Node.js, follow these steps to run SkillMEx in development mode:
- Download or clone this repository
- When starting SkillMEx for the first time, open shells inside both backend and frontend directory and in both directories, execute `npm install` in order to install all npm dependencies.
- As soon as `npm install` is finished, both backend and frontend can be started. Note that these are separate stand-alone applications, so you need to execute `npm run start:dev` in both backend and frontend. 
- Both backendend and frontend should now run in "watch-mode" where changes on either frontend or backend lead to an automatic restart of the server or the web application, respectively. This is quite convenient for development as you don't need to manually restart the server or refresh your browser's page.

### Docker & other pre-built versions
🚧 Currently not available, but on our to-do list 🚧

## Using SkillMEx
Once you have it up and running, SkillMEx acts as a platform for (manufacturing) modules. Modules can be registered and deleted. Skills of modules can be 

## API Documentation
SkillMEx features a quite extensive REST API that can be used to retrieve all registered modules, skills, capabilities and to do other things like run queries. You can find the [documentation in the wiki](https://github.com/aljoshakoecher/SkillMEx/wiki/API-Documentation).

## Further Reading
We present the concept of manufacturing based on semantically modelled capabilities and skills in various scientific publications which are shown in the following list. If you have any questions about these contributions, contact [Aljosha Köcher on ResearchGate](https://www.researchgate.net/profile/Aljosha-Koecher).
* A. Köcher, C. Hildebrandt, B. Caesar, J. Bakakeu, J. Peschke, A. Scholz, A. Fay: *Automating the Development of Machine Skills and their Semantic Description.* In: 2020 25th IEEE International Conference on Emerging Technologies and Factory Automation (ETFA): IEEE, S. 1013–1018, 9/8/2020 - 9/11/2020. 
* A. Köcher, C. Hildebrandt, L.M. Vieira da Silva, A. Fay: *A Formal Capability and Skill Model for Use in Plug and Produce Scenarios.* In: 2020 25th IEEE International Conference on Emerging Technologies and Factory Automation (ETFA): IEEE, S. 1663–1670, 9/8/2020 - 9/11/2020.
* A. Kocher, L.M.V. da Silva, A. Fay: *Constraint Checking of Skills using SHACL.* In: 2021 IEEE 19th International Conference on Industrial Informatics (INDIN): IEEE, S. 1–6, 7/21/2021 - 7/23/2021.
* A. Köcher, T. Jeleniewski, A. Fay: *A Method to Automatically Generate Semantic Skill Models from PLC Code.* In: IECON 2021 – 47th Annual Conference of the IEEE Industrial Electronics Society: IEEE, S. 1–6, 2021.
