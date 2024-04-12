// IMPORTS AND MIDDLEWARE / CONFIG
const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require('../db-config.js');

router.get('/', async function (req, res, next) {
    
    assnCourseData = await getCourseList(req.query.userID);
    
	console.log(assnCourseData[0])
	
    var pageData = {
        pageData: {
            courses:assnCourseData,
            userID:req.query.userID
        },
		courseNum:assnCourseData.length

    };
	console.log(pageData.courseNum);
	res.render('manageCourses',pageData);
});

router.get('/delete', async function (req, res, next){

	courses = await DelCourse(req.query.courseID); //Passing the courseID we want to remove
	
    var pageData = {
        pageData: {
            courses:assnCourseData,
            userID:req.query.userID
        }
    };

	res.render('manageCourses', pageData); //Not sure this is requried if we're removing, but Ill include it anyway

})

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

async function DelCourse(courseID){
//Deleting the course and its associated information

var RemCols = ['course.id', 'submission.course', 'assignments.course'];

var rows = await db('course')
	.select(RemCols)
	.where({
		'course.id':courseID,
	})
	.innerJoin({
		'submission.course':'course.id',
		'assignment.course':'course.id',
	})
	.del(); //the Knex addon for deleting rows


}