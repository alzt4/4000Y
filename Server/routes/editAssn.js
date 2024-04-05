// IMPORTS AND MIDDLEWARE / CONFIG
const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require('../db-config.js');
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');

router.get('/', async function (req, res, next) {

    var assnID = req.query.assnID;
    assnData = await getAssignment(assnID);
    // assnData[0].due = assnData[0].due.toDatestring();
    var pageData = {// TODO: get assignmnent data
        assignment:assnData[0]
    };
    res.render('editAssn',pageData);
});

async function getAssignment(assnID) {
 // columns to fetch from DB
    var fetchCols = ['assignments.name','assignments.course','assignments.overview','assignments.due','assignments.language','assignments.maxScore'];
    var submissionRow = await db('assignments')
       .select(fetchCols)
       .where({
         'assignments.id': assnID
       })
     return submissionRow;
}


module.exports = router;

