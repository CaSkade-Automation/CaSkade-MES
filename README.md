<h1 align="center">SkillMEx - Skill-Based Manufacturing Execution</h1>
<div align="center">
    <img width="400px" src="https://github.com/aljoshakoecher/SkillMEx/blob/documentation/images/documentation/images/SkillUp_logo.png?raw=true">
</div>
<hr>

# Table of Contents
1. [Introduction](https://github.com/aljoshakoecher/SkillMEx#Introduction)
2. [Setup & Install](https://github.com/aljoshakoecher/SkillMEx#setup--install)
3. [Using SkillMEx](https://github.com/aljoshakoecher/SkillMEx#using-skillmex)
4. [Additional Tools](https://github.com/aljoshakoecher/SkillMEx#additional-tools)
5. [API Documentation](https://github.com/aljoshakoecher/SkillMEx#api-documentation)
6. [Further Reading](https://github.com/aljoshakoecher/SkillMEx#further-reading)
<hr>

# Introduction
SkillMEx is a manufacturing execution platform that works with manufacturing modules that have a semantic description of their functions in the form of *capabilities* and *skills*. It's powered by this [capability and skill ontology](https://github.com/aljoshakoecher/machine-skill-model).

*Ontologies? Capabilities? Skills? What?*

Ontologies are a way to create semantic models and to express terms and relations between these terms in a formal and machine-interpretable way. Ontologies allow sophisticated means to interact with information such as complex querying, checking model consistency, infer new information from existing information and apply rules.
We have created a model in the form of an ontology that can be used to model manufacturing modules and the functionalities provided by these modules. This description can roughly be divided into three aspects:
1. **Machine structure**: Our model allows to represent information about the structure of machines and their components
2. **Capabilities**: Capabilities represent the processes that a module can perform. Any arbitrary process may be modeled as a capability. Manufacturing processes can be specified using the industry standards DIN 8580 and VDI 2860. What's important to note is that capabilities don't have to be automatically executable. Manual processes can also be expressed as capabilities. Capabilities provide a means to express required functions as well as the potential functions that are provided by existing modules.
3. **Skills**: Every capability that is automatically executable needs to have a description of how to invoke and interact with this capability. This is the skill aspect of our model. Skills describe interaction mechanisms that are provided by a module in order to automatically use its functionalities.


# Setup & Install

## Development setup

### Requirements

**Node.js**

SkillMEx is built with NestJS & Angular which both rely on Node.js being installed. Make sure to download and install an LTS version of Node. Node.js > v14 is recommended.

**GraphDB**

SkillMEx uses ontologies and stores them in a triple store. We currently work with GraphDB. Make sure to download GraphDB from https://www.ontotext.com/products/graphdb/graphdb-free/ and start it. You then need to create a repository that SkillMEx can use. The connection to a repository can be managed in SkillMEx.
By default, SkillMEx currently expects a repository with ID "test-repo" to exist. This can be changed at runtime but you may run into troubles if you don't have a repository with this name in your GraphDB instance.
In case you cannot connect to your running GraphDB with SkillMEx, you may need to set appropriate CORS policy on GraphDB. This can be done by setting the parameter `graphdb.workbench.cors.enable` to `true` (either in the settings dialogue of the window opening on GraphDB startup or as a command line parameter, see [this SO thread](https://stackoverflow.com/questions/60137895/enable-cors-on-graphdb) for additional details).

**Capability & Skill Ontology**

An "empty" GraphDB doesn't get you far. You have to import the data model for machines, their capabilities and skills that SkillMEx requires. This data model is implemented in an OWL ontology and can be downloaded [here](https://github.com/aljoshakoecher/machine-skill-model). Make sure to take the *merged* version from the latest release.
Once you downloaded it, import it into your GraphDB repository. This is done by using `Import (left sidebar) -> RDF` and then clicking on `Upload RDF files`. Select your file, upload it and - important - do not forget to click `Import` on the right once your file has been uploaded.


### Starting SkillMEx
After you have checked all the requirements, follow these steps to run SkillMEx in development mode:
- Download or clone this repository
- When starting SkillMEx for the first time, open shells inside both backend and frontend directory and in both directories, execute `npm install` in order to install all npm dependencies.
- As soon as `npm install` is finished, both backend and frontend can be started. Note that these are separate stand-alone applications, so you need to execute `npm run start:dev` in both backend and frontend. 
- Both backend and frontend should now run in "watch-mode" where changes on either frontend or backend lead to an automatic restart of the server or the web application, respectively. This is quite convenient for development as you don't need to manually restart the server or refresh your browser's page.


## Docker & other pre-built versions
🚧 Currently not available, but on our to-do list 🚧


# Using SkillMEx
Once you have it up and running, SkillMEx acts as a platform for (manufacturing) modules. Modules can be registered with their capabilities and skills and later deleted. Additional capabilities and skills can also be added later. Skills with different execution technologies can be executed through a unified interface. Skill processes can be modeled and executed using BPMN.


**See some of SkillMEx' functions in these screenshots**
<table>
  <tr>
    <td width="50%">
      <img src="https://github.com/aljoshakoecher/SkillMEx/blob/documentation/images/documentation/images/screenshots/dashboard.png?raw=true" width="100%" alt="Dashboard"/>
    </td>
    <td width="50%">
      <img src="https://github.com/aljoshakoecher/SkillMEx/blob/documentation/images/documentation/images/screenshots/module-overview.png?raw=true" width="100%" alt="Module Overview"/>
    </td>
  </tr>
  <tr>
    <td>Dashboard to see all active entities</td>
    <td>Overview of modules and their skills</td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://github.com/aljoshakoecher/SkillMEx/blob/documentation/images/documentation/images/screenshots/register-modules.png?raw=true" width="100%" alt="Different ways to register modules"/>
    </td>
    <td width="50%">
      <img src="https://github.com/aljoshakoecher/SkillMEx/blob/documentation/images/documentation/images/screenshots/graph-visu.png?raw=true" width="100%" alt="Graph Visualization"/>
     </td>
   </tr>
   <tr>
    <td>Different ways to register modulese</td>
    <td>Intuitive Graph Visualization</td>
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

# Additional Tools
## Automatically create and register skills from Java source code
We created [SkillUp](https://github.com/aljoshakoecher/skill-up) which takes away all the effort involved in creating a skill. If you do it "manually", there is a lot that needs to be done. You need to develop skills in a certain way (using a state machine). You need to provide an interface technology to invoke your skill's behavior (either OPC UA server or web server) and you need to create a rather large and complex ontology to describe all that.
The good news is: SkillUp automates it all for you and even registers yours modules and skills at SkillMEx. Checkout the [SkillUp Wiki](https://github.com/aljoshakoecher/skill-up/wiki) for an extended step-by-step documentation on how to get started.

## Modelling and executing skill-processes using BPMN
Single skills can be executed from the module overview or skill management. But what if you want to model (and eventually execute) complete production processes? Of course, manually stepping through a process with multiple skills is not an option.
Instead, SkillMEx uses BPMN to model and execute BPMN processes.

**Modelling Processes**

Complete production processes (including different task types, parallel / alternative flows, events) can be modelled using an integrated BPMN modeling tool based on [bpmn-js](https://github.com/bpmn-io/bpmn-js). We integrated a BPMN modeller into SkillMEX. Currently, the following task types are integrated:
- Service tasks can be used for skill execution. Select one of your currently registered skills, pick the transition (most likely "Start") and set the parameters in case your skill has any
- User Tasks can be used to assign a task to a person or a group, but currently, no real tasks (e.g. inputs to enter) can be modelled with SkillMEx. Nevertheless, user tasks can be useful to make the process stop in order to look into the current execution.
- Mail send tasks can be used to automatically send mails. In case you want to use it. Make sure to setup the mail send functionality as described [here](https://github.com/camunda-community-hub/camunda-bpm-mail#how-to-configure-it). You need to have the required jars and the config file on the classpath of your Camunda BPMN engine (typically the server's lib folder) [see details here](https://github.com/camunda-community-hub/camunda-bpm-mail#for-shared-process-engine)
- Outputs (e.g. of a skill execution) can be used as conditions on subsequent flows. The syntax is "_variable_ _relation_ _value_" where relation might be something like "==", "<=" and so on. The variable might be an output of a previous activity. Variables are refered by their IDs which are created by concatenating an activityID and the output name like so: "activityID_output-name". Use ctrl + space inside a condition to get a very simple autocomplete suggesting you all the outputs of your model.


**Executing Processes**
  
In order to deploy processes and execute them, you need to have a BPMN engine. SkillMEx is currently bound to the open-source Camunda BPMN engine which can be downloaded [here](https://camunda.com/download/#download-other-menu). So far, we have only used the TomCat distribution. Download it and start it according to documentation (should be rather straightforward, you basically unzip it and start it using the "start-camunda" command).
Naturally, Camunda doesn't know anything about skills and skill processes. In order to execute skill processes, you need to have an extension we developed which you can grab [here](https://github.com/aljoshakoecher/BPMN-Skill-Executor/releases). Take the jar from the latest release and drop it into your Camunda servers lib folder. Note: Don't drop it into the lib folder inside the root folder. It needs to be the lib folder under server/apache-tomcat
    

# API Documentation
SkillMEx features a quite extensive REST API that can be used to retrieve all registered modules, skills, capabilities and to do other things like run queries. You can find the [documentation in the wiki](https://github.com/aljoshakoecher/SkillMEx/wiki/API-Documentation).

# Further Reading
We present the concept of manufacturing based on semantically modelled capabilities and skills in various scientific publications which are shown in the following list. If you have any questions about these contributions, contact [Aljosha Köcher on ResearchGate](https://www.researchgate.net/profile/Aljosha-Koecher).
* A. Köcher, C. Hildebrandt, B. Caesar, J. Bakakeu, J. Peschke, A. Scholz, A. Fay: *Automating the Development of Machine Skills and their Semantic Description.* In: 2020 25th IEEE International Conference on Emerging Technologies and Factory Automation (ETFA): IEEE, S. 1013–1018, 9/8/2020 - 9/11/2020. 
* A. Köcher, C. Hildebrandt, L.M. Vieira da Silva, A. Fay: *A Formal Capability and Skill Model for Use in Plug and Produce Scenarios.* In: 2020 25th IEEE International Conference on Emerging Technologies and Factory Automation (ETFA): IEEE, S. 1663–1670, 9/8/2020 - 9/11/2020.
* A. Köcher, L.M.V. da Silva, A. Fay: *Constraint Checking of Skills using SHACL.* In: 2021 IEEE 19th International Conference on Industrial Informatics (INDIN): IEEE, S. 1–6, 7/21/2021 - 7/23/2021.
* A. Köcher, T. Jeleniewski, A. Fay: *A Method to Automatically Generate Semantic Skill Models from PLC Code.* In: IECON 2021 – 47th Annual Conference of the IEEE Industrial Electronics Society: IEEE 2021.
* A. Köcher, L.M. Vieira da Silva, A. Fay: *Modeling and Executing Production Processes with Capabilities and Skills using Ontologies and BPMN*. In: 2022 27th IEEE International Conference on Emerging Technologies and Factory Automation (ETFA): IEEE, 2022.
* A. Köcher, L. Beers, A. Fay: *A Mapping Approach to Convert MTPs into a Capability and Skill Ontology*. In: 2022 IEEE 27th International Conference on Emerging Technologies and Factory Automation (ETFA): IEEE, 2022.
