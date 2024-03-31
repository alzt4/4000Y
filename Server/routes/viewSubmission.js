// IMPORTS AND MIDDLEWARE / CONFIG
const express = require("express");
const router = express.Router();
const date = require('date-and-time');
router.use(express.json());
const db = require('../db-config.js');

/* GET home page. */
router.get('/', async function (req, res, next) {

  //Get submission ID 
  var subID = req.query.subID;
  //Fetch submission from db
  var submission = await getSubmissionDetails(subID);
  
  //Fetch previous assignment attempt IDs

  var prevAttempts = await getPreviousAttempts(submission[0].assnID, subID);
  console.log(prevAttempts);

  var attemptNo = 0;
  prevAttempts.forEach((attempt) => {
    if (attempt.id == subID) {
      attemptNo = attempt.attemptNo;
    }
  })

  var assnData = {
    assignmentAttempt: {
      "assignment": {
        "id":submission[0].assnID,
        "assignmentName": submission[0].assnName
      },
      "attempts": prevAttempts,
      "attemptNo":attemptNo,
      "timeDue": date.format(submission[0].due, 'ddd, MMM DD YYYY hh:mm A'),
      "timeSubmitted": date.format(submission[0].date_uploaded, 'ddd, MMM DD YYYY hh:mm A'),
      "scores": {
        "main": {
          "score": submission[0].grade,
          "maxScore": submission[0].maxScore,
          "plagScore": submission[0].plage_grade
        }
      },
      "unitTest": JSON.parse(Buffer.from(submission[0].results, 'base64').toString()),
      "submissionFiles": [{
        "id": submission[0].subID,
        "name": submission[0].filename
      }]
    },
    courseName: submission[0].courseName
  };

  res.render('viewSubmission', assnData);

});


async function getSubmissionDetails(subID) {
  // columns to fetch from DB
  var fetchCols = ['submission.id as subID', 'submission.filename', 'submission.path',
    'submission.grade','submission.plage_grade','submission.results','assignments.test', 'assignments.due',
    'assignments.maxScore as maxScore','assignments.language', 'submission.date_uploaded', 'assignments.name as assnName',
    'assignments.id as assnID', 'course.name as courseName'];
  var submissionRow = await db('submission')
    .select(fetchCols)
    .where({
      'submission.id': subID
    })
    .innerJoin(
      'assignments',
      { 'assignments.id': 'submission.assn' }
    )
    .innerJoin(
      'course',
      { 'assignments.course': 'course.id' }
    );
  return submissionRow;
}

async function getPreviousAttempts(assnID, subID) {
  var fetchCols = ['submission.id', 'submission.date_uploaded'];

  var attemptRows = await db('submission')
    .select(fetchCols)
    .where({
      'submission.assn': assnID
    })
    .orderBy('submission.date_uploaded', 'desc')
    .rowNumber('attemptNo','submission.date_uploaded')
    .limit(5);

  return attemptRows;
}

module.exports = router;
