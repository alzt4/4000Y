// IMPORTS AND MIDDLEWARE / CONFIG
const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require('../db-config.js');
const date = require('date-and-time');

router.get('/', async function (req, res, next) {

    var assnID = req.query.assnID;
    //Get course data
    assnCourseData = await getAssnDetails(assnID);

    //Get Required file data
    var requiredFileData = await getRequiredFiles(assnID);
    console.log(requiredFileData);
    
    var pageData = {
        pageData: {
            course: {
                id: assnCourseData[0].courseId,
                name:assnCourseData[0].courseName
            },
            assignment: {
                id: assnCourseData[0].id,
                name: assnCourseData[0].assnName,
                dueDate: date.format(assnCourseData[0].due, 'ddd, MMM DD YYYY hh:mm A'),
                overview: assnCourseData[0].overview,
                maxScore: assnCourseData[0].maxScore,
                requiredFiles: requiredFileData
            }

        }
    };
    res.render('newSub',pageData);
});

module.exports = router;

async function getAssnDetails(assnID) {
    // columns to fetch from DB
    var fetchCols = ['assignments.id','assignments.overview',
        'assignments.language', 'assignments.name as assnName','assignments.due', 'course.id',
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
  
async function getRequiredFiles(assnID) {
    // columns to fetch from DB

    var fetchCols = ['required_files.name'];
    var requiredFiles = await db('required_files')
        .select(fetchCols)
        .where({
            'required_files.assn': assnID
        });
    return requiredFiles;
}

