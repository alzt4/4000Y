// IMPORTS AND MIDDLEWARE / CONFIG
const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require('../db-config.js');

router.get('/', async function (req, res, next) {

    var courseID = req.query.courseID;
    assnCourseData = await getCourseDetails(courseID);
    var pageData = {

    };
    res.render('newAssn',pageData);
});

module.exports = router;

async function getCourseDetails(courseID) {
    // // columns to fetch from DB
    // var fetchCols = [];
    
    // var submissionRow = await db('course')
    //   .select(fetchCols)
    //   .where({
    //     'course.id': assnID
    //   })
    // return submissionRow;
}