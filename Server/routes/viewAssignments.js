// IMPORTS AND MIDDLEWARE / CONFIG
const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require('../db-config.js');

router.get('/', async function (req, res, next) {
    
    assnData = await getAssignments(req.query.courseID);
    console.log(assnData);
    var pageData = {
        pageData: {
            assignments: assnData,
            courseID:req.query.courseID
        }
    };
    res.render('viewAssignments',pageData);
});
module.exports = router;


async function getAssignments(courseID) {
    // columns to fetch from DB
   
      var fetchCols = ['assignments.id','assignments.name','assignments.course','assignments.overview','assignments.due','assignments.language','assignments.maxScore'];
    var submissionRow = await db('assignments')
        .select(fetchCols)
        .where({
        'assignments.course': courseID
        });
    return submissionRow;
  }