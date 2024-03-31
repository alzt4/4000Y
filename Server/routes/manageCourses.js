// IMPORTS AND MIDDLEWARE / CONFIG
const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require('../db-config.js');

router.get('/', async function (req, res, next) {

    var pageData = {

    };
    res.render('manageCourses',pageData);
});

module.exports = router;

async function getCourses(profID) {
    // // columns to fetch from DB
    // var fetchCols = [];
    
    // var submissionRow = await db('course')
    //   .select(fetchCols)
    //   .where({
    //     'course.id': assnID
    //   })
    // return submissionRow;
}