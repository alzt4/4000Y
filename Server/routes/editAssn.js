// IMPORTS AND MIDDLEWARE / CONFIG
const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require('../db-config.js');
const express = require("express");
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const db = require('../db-config.js');

router.get('/', async function (req, res, next) {

    var courseID = req.query.courseID;
    assnData = await getAssignment(assnID);
    var pageData = {// TODO: get assignmnent data

    };
    res.render('editAssn',pageData);
});

// TODO: get assignmnent data
async function getAssignment(assnID) {
 // columns to fetch from DB
     var fetchCols = [];
    
    var submissionRow = await db('assignments')
       .select(fetchCols)
       .where({
         'assignments.id': assnID
       })
     return submissionRow;
}


router.post('/', function (req, res, next) {

    const form = new formidable.IncomingForm(); //Get the form?
    form.parse(req, async (err, fields, files) => {
        console.log(files);

        assnID = fields.assnID

        //Create and catch created assignment
        var assnData = {
            "id": assnID,
            "name": fields.assn_name,
            "course": fields.course,
            "overview": fields.assn_descrip,
            "due": fields.dueDate,
            "professor": fields.professor,
            "language": fields.language,
            "maxScore":fields.maxScore
        };

        await updateAssn(assnData);

        //Create Required File Entries
        var reqFiles = JSON.parse(fields.reqFiles);
        reqFiles.forEach(async (file) => {
            file["assn"] = assnID;
            await updateReqFile(file);
        });

        //Store Unit Test in files/unit_tests/<assign_no>
        fs.mkdirSync(path.join(__dirname, `../../files/unit_tests/${assnID}`));
        let oldpath = files['files[0]'][0].filepath;
        let newpath = path.join(__dirname, `../../files/unit_tests/${assnID}`) + '/' + files['files[0]'][0].originalFilename;
        let rawdata = fs.readFileSync(oldpath);

        fs.writeFileSync(newpath, rawdata, (err) => {	
            if (err) console.log(err);				

            console.log("Unit test write successful");
        });

        var unitTestData = {
            "name": fields.unitTest,
            "assnID": assnID,
            "language": fields.language,
            "size": files['files[0]'][0].size,
            "path": files['files[0]'][0].originalFilename
        };



        var newUnitTestID = await updateUnitTest(unitTestData);

    });

});

async function updateAssn(assnData) {
    // columns to fetch from DB
    var [id] = await db('assignments').update(assnData);
    return id;
}

async function updateReqFile(reqData) {
    // columns to fetch from DB
    var [id] = await db('required_files').update(reqData);
    return id;
}

async function updateUnitTest(testData) {
    // columns to fetch from DB
    var [id] = await db('unit_tests').update(testData);
    return id;
}

module.exports = router;

