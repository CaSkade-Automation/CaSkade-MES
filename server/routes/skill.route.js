var express = require('express');
var router = express.Router();
// var QueryMapper = require('../models/selfdescription/GraphQueryMapper')
// var queryMapper = new QueryMapper();
const SkillModel = require('./../models/skill.model');
const skillModel = new SkillModel();

// TODO: Make sure OPC UA is included here too
module.exports = function (socketServer, graphDbConnection) {

  // get all executable skills
  router.get('', function (req, res) {
    skillModel.getAllSkills().then((skillQueryResult) => {
      const skills = skillQueryResult.results.bindings;
      res.status(200).json(skills);
    })
      .catch((err) => {
        res.status(500).send(`Error while retrieving all skills, ${err}`)
      });
  });


  // get one skill by its IRI
  router.get('/:skillIri', function (req, res) {
    const skillIri = decodeURIComponent(req.params.skillIri);

    skillModel.getSkillByIri(skillIri).then((skillQueryResult) => {
      const skill = skillQueryResult.results.bindings;
      res.status(200).json(skill);
    })
      .catch((err) => {
        res.status(500).send(`Error while skill with IRI, ${skillIri}. Error: ${err}`)
      });
  });



  return router;
};







