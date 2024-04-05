const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const db = require('../db-config.js');

router.post('/', function (req, res, next) {

    const form = new formidable.IncomingForm(); //Get the form?
    form.parse(req, async (err, fields, files) => {
        console.log(files);

        //Create and catch created assignment
        var assnData = {
            "name": fields.assn_name,
            "course": fields.course,
            "overview": fields.assn_descrip,
            "due": fields.dueDate,
            "professor": fields.professor,
            "language": fields.language,
            "maxScore":fields.maxScore
        };

        var newAssnID = await createAssn(assnData);

        //Create Required File Entries
        var reqFiles = JSON.parse(fields.reqFiles);
        reqFiles.forEach(async (file) => {
            file["assn"] = newAssnID;
            var reqFileID = await createReqFile(file);
        });

        //Store Unit Test in files/unit_tests/<assign_no>
        fs.mkdirSync(path.join(__dirname, `../../files/unit_tests/${newAssnID}`));
        let oldpath = files['files[0]'][0].filepath;
        let newpath = path.join(__dirname, `../../files/unit_tests/${newAssnID}`) + '/' + files['files[0]'][0].originalFilename;
        let rawdata = fs.readFileSync(oldpath);

        fs.writeFileSync(newpath, rawdata, (err) => {	
            if (err) console.log(err);				

            console.log("Unit test write successful");
        });

        var unitTestData = {
            "name": fields.unitTest,
            "assnID": newAssnID,
            "language": fields.language,
            "size": files['files[0]'][0].size,
            "path": files['files[0]'][0].originalFilename
        };

        var newUnitTestID = await createUnitTest(unitTestData);

        res.status(200).send({
            "message": "Success",
        });
    });

});

async function createAssn(assnData) {
    // columns to fetch from DB
    var [id] = await db('assignments').insert(assnData);
    return id;
}

async function createReqFile(reqData) {
    // columns to fetch from DB
    var [id] = await db('required_files').insert(reqData);
    return id;
}

async function createUnitTest(testData) {
    // columns to fetch from DB
    var [id] = await db('unit_tests').insert(testData);
    return id;
}

module.exports = router;