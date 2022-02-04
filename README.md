<h1 align="center">SkillMEx - Skill-Based Manufacturing Execution</h1>
<div align="center">
    <img width="400px" src="https://github.com/aljoshakoecher/SkillMEx/blob/documentation/images/documentation/images/SkillUp_logo.png?raw=true">
</div>
<hr>

## Table of Contents
1. [Introduction](https://github.com/aljoshakoecher/SkillMEx#Introduction)
2. [Setup & Install](https://github.com/aljoshakoecher/SkillMEx#setup--install)
3. [Using SkillMEx](https://github.com/aljoshakoecher/SkillMEx#using-skillmex)
4. [Additional Tools](https://github.com/aljoshakoecher/SkillMEx#additional-tools)
5. [API Documentation](https://github.com/aljoshakoecher/SkillMEx#api-documentation)
6. [Further Reading](https://github.com/aljoshakoecher/SkillMEx#further-reading)
<hr>

## Introduction
SkillMEx is a manufacturing execution platform that works with manufacturing modules that have a semantic description of their functions in the form of *capabilities* and *skills*. It's powered by this [capability and skill ontology](https://github.com/aljoshakoecher/machine-skill-model).

*Ontologies? Capabilities? Skills? What?*

Ontologies are a way to create semantic models and to express terms and relations between these terms in a formal and machine-interpretable way. Ontologies allow sophisticated means to interact with information such as complex querying, checking model consistency, infer new information from existing information and apply rules.
We have created a model in the form of an ontology that can be used to model manufacturing modules and the functionalities provided by these modules. This description can roughly be divided into three aspects:
1. **Machine structure**: Our model allows to represent information about the structure of machines and their components
2. **Capabilities**: Capabilities represent the processes that a module can perform. Any arbitrary process may be modeled as a capability. Manufacturing processes can be specified using the industry standards DIN 8580 and VDI 2860. What's important to note is that capabilities don't have to be automatically executable. Manual processes can also be expressed as capabilities. Capabilities provide a means to express required functions as well as the potential functions that are provided by existing modules.
3. **Skills**: Every capability that is automatically executable needs to have a description of how to invoke and interact with this capability. This is the skill aspect of our model. Skills describe interaction mechanisms that are provided by a module in order to automatically use its functionalities.


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
Once you have it up and running, SkillMEx acts as a platform for (manufacturing) modules. Modules can be registered with their capabilities and skills and later deleted. Additional capabilities and skills can also be added later. Skills with different execution technologies can be executed through a unified interface. Skill processes can be modeled and executed using BPMN.


**See some of SkillMEx' functions in these screenshots**
<table>
  <tr>
    <td width="50%">
      <img src="https://github.com/aljoshakoecher/SkillMEx/blob/documentation/images/documentation/images/screenshots/module-overview.png?raw=true" width="100%" alt="my alt text"/>
    </td>
    <td width="50%">
      <img src="https://github.com/aljoshakoecher/SkillMEx/blob/documentation/images/documentation/images/screenshots/register-modules.png?raw=true" width="100%" alt="my alt text"/>
    </td>
  </tr>
  <tr>
    <td>Overview of modules and their skills</td>
    <td>Different ways to register modules</td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/aljoshakoecher/SkillMEx/blob/documentation/images/documentation/images/screenshots/model-processes.png?raw=true" width="100%" alt="my alt text"/>
    </td>
      <td width="50%">
        <img src="https://github.com/aljoshakoecher/SkillMEx/blob/documentation/images/documentation/images/screenshots/deployed%20processes.png?raw=true" width="100%" alt="my alt text"/>
    </td>
  </tr>
   <tr>
    <td>Model skills processes using BPMN</td>
    <td>See processes that have been deployed and are ready to be executed</td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/aljoshakoecher/SkillMEx/blob/documentation/images/documentation/images/screenshots/active-process-instances.png?raw=true" width="100%" alt="my alt text"/>
    </td>
      <td width="50%">
    </td>
  </tr>
   <tr>
    <td>Keep on track with currently running process instances</td>
    <td></td>
  </tr>
</table>

## Additional Tools

## API Documentation
SkillMEx features a quite extensive REST API that can be used to retrieve all registered modules, skills, capabilities and to do other things like run queries. You can find the [documentation in the wiki](https://github.com/aljoshakoecher/SkillMEx/wiki/API-Documentation).

## Further Reading
We present the concept of manufacturing based on semantically modelled capabilities and skills in various scientific publications which are shown in the following list. If you have any questions about these contributions, contact [Aljosha Köcher on ResearchGate](https://www.researchgate.net/profile/Aljosha-Koecher).
* A. Köcher, C. Hildebrandt, B. Caesar, J. Bakakeu, J. Peschke, A. Scholz, A. Fay: *Automating the Development of Machine Skills and their Semantic Description.* In: 2020 25th IEEE International Conference on Emerging Technologies and Factory Automation (ETFA): IEEE, S. 1013–1018, 9/8/2020 - 9/11/2020. 
* A. Köcher, C. Hildebrandt, L.M. Vieira da Silva, A. Fay: *A Formal Capability and Skill Model for Use in Plug and Produce Scenarios.* In: 2020 25th IEEE International Conference on Emerging Technologies and Factory Automation (ETFA): IEEE, S. 1663–1670, 9/8/2020 - 9/11/2020.
* A. Kocher, L.M.V. da Silva, A. Fay: *Constraint Checking of Skills using SHACL.* In: 2021 IEEE 19th International Conference on Industrial Informatics (INDIN): IEEE, S. 1–6, 7/21/2021 - 7/23/2021.
* A. Köcher, T. Jeleniewski, A. Fay: *A Method to Automatically Generate Semantic Skill Models from PLC Code.* In: IECON 2021 – 47th Annual Conference of the IEEE Industrial Electronics Society: IEEE, S. 1–6, 2021.
