// IMPORTS AND MIDDLEWARE / CONFIG
const express = require("express");
const router = express.Router();
const date = require('date-and-time');
router.use(express.json());
const db = require('../db-config.js');

router.get('/', async function (req, res, next) {

    //Get assn and course data
    var assnCourseData = await getAssnDetails(req.query.assnID);

    //Get Unit Test Data

    var unitTestData = await getUnitTests(req.query.assnID);

    //Get previous attempts

    var prevAttemptData = await getPreviousAttempts(req.query.assnID);
    console.log(prevAttemptData);
    
    var pageData = {
        pageData: {
            course: {
                id: assnCourseData[0].courseId,
                name: assnCourseData[0].courseName
            },
            assignment: {
                id: assnCourseData[0].id,
                name: assnCourseData[0].assnName,
                overview: assnCourseData[0].overview,
                dueDate: date.format(assnCourseData[0].due, 'ddd, MMM DD YYYY hh:mm A'),
                maxScore: assnCourseData[0].maxScore,
                requiredFiles: [
                    {
                        name: "main.py"
                    },
                    {
                        name: "requirements.txt"
                    }
                ],
                unitTests: unitTestData
            },
            attempts:prevAttemptData,

        }
    };
    res.render('assnSubHome', pageData);
});

module.exports = router;


async function getAssnDetails(assnID) {
    // columns to fetch from DB

    var fetchCols = ['assignments.id', 'assignments.test', 'assignments.overview as overview',
        'assignments.language', 'assignments.name as assnName', 'assignments.due', 'assignments.maxScore', 'course.id as courseId',
        'course.name as courseName'];
    var submissionRow = await db('assignments')
        .select(fetchCols)
        .where({
            'assignments.id': assnID
        })
        .innerJoin(
            'course',
            { 'assignments.course': 'course.id' }
        );
    return submissionRow;
}

async function getUnitTests(assnID) {
    // columns to fetch from DB

    var fetchCols = ['unit_tests.id','unit_tests.name'];
    var unitTestRows = await db('unit_tests')
        .select(fetchCols)
        .where({
            'unit_tests.assnID': assnID
        })
        .orderBy('unit_tests.id', 'desc')
        .rowNumber('testNo', 'unit_tests.id')
    return unitTestRows;
}


async function getPreviousAttempts(assnID) {
    var fetchCols = ['submission.id', 'submission.date_uploaded', 'submission.grade as score','assignments.maxScore'];

    var attemptRows = await db('submission')
        .select(fetchCols)
        .innerJoin(
            'assignments',
            { 'assignments.id': 'submission.assn' }
        )
        .where({
            'submission.assn': assnID
        })
        .orderBy('submission.date_uploaded', 'desc')
        .rowNumber('attemptNo', 'submission.date_uploaded')
        .limit(5);

    return attemptRows;
}