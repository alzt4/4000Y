// IMPORTS AND MIDDLEWARE / CONFIG
const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require('../db-config.js');

router.get('/', async function (req, res, next) {

	courseName = await getCourses(req.query.id);

	//console.log(courseName[0]);
    // ^ was a testing line.

	var pageData = {
		pageData:{
			id:req.query.id,
			courses: courseName[0].name,
			desc: courseName[0].description //This isnt proper, I know that its not proper
		}
    };
	console.log(pageData);
    res.render('editCourse',pageData);
});

module.exports = router;

async function getCourses(courseID) {
    //Columns to fetch from DB
	var fetchCols = ["course.id", "course.name", "course.Student_Roster", "course.TA", "course.assignments", "course.description"];
	var subRow = await db('course')
		.select(fetchCols)
		.where({
			'course.id':courseID
		});
	return subRow;

}
