// IMPORTS AND MIDDLEWARE / CONFIG
const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require('../db-config.js');

router.get('/', async function (req, res, next) {
    
    assnCourseData = await getCourseList(req.query.userID);
    
    var pageData = {
        pageData: {
            courses: assnCourseData,
            userID: req.query.userID
        }
    };
    res.render('manageCourses',pageData);
});
module.exports = router;


async function getCourseList(userID) {
    // columns to fetch from DB
   
      var fetchCols = ['course.id as courseId',
      'course.name as courseName', 'course.department'];
    var submissionRow = await db('course')
        .select(fetchCols)
        .where({
        'course.professor': userID
        });
    return submissionRow;
  }