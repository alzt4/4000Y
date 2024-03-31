// IMPORTS AND MIDDLEWARE / CONFIG
const express = require("express");
const router = express.Router();
const date = require('date-and-time');
router.use(express.json());
const db = require('../db-config.js');

router.get('/', async function (req, res, next) {

    assnCourseData = await getAssnDetails(req.query.userID, req.query.courseID);

    var pageData = {
        pageData: {
            course: {
                id: assnCourseData[0].courseId,
                name: assnCourseData[0].courseName,
                department: assnCourseData[0].department
            },
            assignments: assnCourseData

        }
    };
    res.render('viewCourse', pageData);
});

module.exports = router;


async function getAssnDetails(userID, courseID) {
    console.log(userID);
    console.log(courseID);
    // columns to fetch from DB
    // SELECT FROM submission INNER JOIN course ON submission.course = course.id AND submission.uploader = {userID}
    // AND submission.course = {courseID} RIGHT JOIN assignments ON submission.assn = assignment.id
    var fetchCols = ['assignments.id', 'assignments.overview as overview',
        'assignments.name as assnName', 'assignments.due', 'assignments.maxScore', 'course.id as courseId',
        'course.name as courseName', 'course.department', 'submission.grade', 'submission.uploader'];
    var submissionRow = await db('submission')
        .select(fetchCols)
        .innerJoin(
            'course', function () {
                this.on('submission.course', '=', 'course.id')
                    .andOnIn('submission.uploader', [userID])//this does the equivalent of ON ... AND uploader = userID, but since
                    .andOnIn('submission.course', [courseID]) //userID and courseIDs are constants, knex makes a big fuss so this is a work around
            }
        )
        .rightJoin(
            'assignments',
            { 'submission.assn': 'assignments.id' }
        );
    return submissionRow;
}