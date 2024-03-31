// IMPORTS AND MIDDLEWARE / CONFIG
const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require('../db-config.js');

router.get('/', async function (req, res, next) {

    var assnID = req.query.assnID;
    assnCourseData = await getAssnDetails(assnID);
    var pageData = {
        pageData: {
            course: {
                id: assnCourseData[0].courseId,
                name:assnCourseData[0].courseName
            },
            assignment: {
                id: assnCourseData[0].id,
                name: assnCourseData[0].assnName,
                overview: assnCourseData[0].overview,
                maxScore: assnCourseData[0].maxScore,
                requiredFiles: [
                    {
                        name: "main.py"
                    },
                    {
                        name: "requirements.txt"
                    }
                ]
            }

        }
    };
    res.render('newSub',pageData);
});

module.exports = router;

async function getAssnDetails(assnID) {
    // columns to fetch from DB
    var fetchCols = ['assignments.id','assignments.test','assignments.overview',
        'assignments.language', 'assignments.name as assnName', 'course.id',
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