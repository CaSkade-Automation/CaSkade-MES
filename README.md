<div align="center">
    <img width="400px" src="https://github.com/aljoshakoecher/SkillMEx/blob/documentation/images/documentation/images/SkillUp_logo.png?raw=true">
</div>
<h1 align="center">A Skill-Based Control Platform</h1>



A web based plattform to manage automated modules based on semantic descriptions.  
The platform consists of two parts: 
- NodeJS-Backend: The backend is connected with a graph database and provides core functions for modules (registering, adding capabilites, executing services, executing queries against the graph database)
- Angular fronted: The frontend provides a user interface to interact with connected modules (e.g. to execute their services)


## Setup & Install
- Clone this repository (via SSH)
- Before running the project for the first time, change into the project's folder and execute `npm install` 
- After installing, execute `npm run start-all`. This Script starts backend and frontend at the same time. Both are startet in some kind of "watch-mode" where changes on either front- or backend lead to an automatic restart of the server or the web application, respectively. No need to manually restart the server or refresh your browser's page.

# API Documentation
