const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const { spawn, spawnSync } = require('child_process');
router.use(express.json());
const db = require('../db-config.js');

router.post('/', function (req, res, next) {

    console.log("test");
    const form = new formidable.IncomingForm(); //Get the form?

    let assnPaths = Array();
    var primaryFile = null;
    form.parse(req, async (err, fields, files) => {

        // console.log(fields);
        console.log(files);

        // console.log(fields.assignment_id[0]);
        // console.log(fields.user_id[0]);
        
        // for (var i = 0; i < files.length; i++){
        //     console.log(`HERE ${files[`files[${i}]`][0].originalFilename}`);

        //     if (files[`files[${i}]`][0].originalFilename.includes(".py")) {
        //         console.log("FOUND");
        //         primaryFile = i;
        //     }
        // }

        Object.keys(files).forEach((fIndex) => {
            if (files[fIndex][0].originalFilename.includes(".py") || files[fIndex][0].originalFilename.includes(".cpp")) {
                primaryFile = fIndex;
            }
        });

        
        var course = await getAssnCourse(fields.assignment_id[0]);
        console.log(course[0].course);

        //Create a submission row

        var subData = {
            "uploader": fields.user_id[0],
            "assn": fields.assignment_id[0],
            "course":course[0].course
        };

        console.log(files['files[0]'][0].originalFilename);
        var newSubID = await createSub(subData);

        fs.mkdirSync(path.join(__dirname, `../../files/submissions/${newSubID}`));

        Object.keys(files).forEach((fIndex) => {

            let oldpath = files[fIndex][0].filepath;
            let newpath = path.join(__dirname, `../../files/submissions/${newSubID}`) + '/' + files[fIndex][0].originalFilename;
            let rawdata = fs.readFileSync(oldpath); //This is getting the data of the file from temp

            assnPaths.push(newpath);
            fs.writeFileSync(newpath, rawdata, (err) => {	//Writing the file into the "uploads" directory, which will be changed depending on user, course, and assignment.
                if (err) console.log(err);				//The User should have no control over where the file is uploaded to other than the selection of the course and assignment they're uploading to, which can be controlled through the UI

                console.log("File write successful");
            });

        });

        await updateSub(newSubID, {
            "filename": files[primaryFile][0].originalFilename,
            "size": files[primaryFile][0].size,
            "path": path.join(__dirname, `../../files/submissions/${newSubID}`) + '/' + files[primaryFile][0].originalFilename
        });

        //Get Unit Test path from DB 

        var unitTest = await getUnitTest(fields.assignment_id[0]);
        console.log(unitTest[0].path);

        var unitTestPath = path.join(__dirname, `../../files/unit_tests/${unitTest[0].assnID}/${unitTest[0].path}`);
        console.log(unitTestPath);

        if (unitTestPath.includes(".py")) {
            //Run unit tests through docker container
            let args = Array();
            args.push(path.join(__dirname,"../../Docker/Scripts/runDockerPy.sh"));
            args.push(unitTestPath);
            args.push(path.join(__dirname,`../../files/submissions/${newSubID}`));
            console.log(args);

            var child = spawnSync("sudo", args, { encoding: 'utf8' });
            console.log("Unit Test finished.");
            if (child.error) {
                console.log("ERROR: ", child.error);
            }
            
            console.log(child.stdout);

            var resultJSON = JSON.parse(Buffer.from(child.stdout, 'base64').toString());
            
            //Calculate Score from JSON
            var subScore = 100 / resultJSON.total;
            var totalScore = 100;

            var scoreVal = resultJSON.successes * subScore;

        }
        //If C++ detected
        else if (unitTestPath.includes(".cpp")) {
            ///home/osboxes/Desktop/4000Y/4000Y/Docker/Scripts/runDockerCpp.sh /home/osboxes/Desktop/4000Y/4000Y/Docker/ExampleCourse2/unit_test.cpp /home/osboxes/Desktop/4000Y/4000Y/Docker/ExampleCourse2/student1/student_module
            //Run unit tests through docker container
            let args = Array();
            args.push(path.join(__dirname,"../../Docker/Scripts/runDockerCpp.sh"));
            args.push(unitTestPath);
            args.push(path.join(__dirname,`../../files/submissions/${newSubID}`));
            console.log(args);

            var child = spawnSync("sudo", args, { encoding: 'utf8'});
            console.log("Unit Test finished.");
            if (child.error) {
                console.log("ERROR: ", child.error);
            }

            var resultJSON = JSON.parse(Buffer.from(child.stdout, 'base64').toString());

            var subScore = 100 / resultJSON.tests;
            var totalScore = 100;
            var scoreVal = (resultJSON.tests-(resultJSON.failures+resultJSON.disabled+resultJSON.errors)) * subScore;

            console.log(resultJSON);
        }

        //Run plagiarism check.

        var plagArgs = Array(path.join(__dirname, "../../Plagiarism_Checker/scripts/plagiarism_launcher.sh"));
        plagArgs.push("default");
        plagArgs.push(path.join(__dirname,`../../files/submissions/${newSubID}`));

        console.log(plagArgs);
        
        var plagChild = spawnSync("sudo", plagArgs, { encoding: 'utf8' });
        if (plagChild.error) {
            console.log("ERROR: ", plagChild.error);
        }

        var plagResult = Buffer.from(plagChild.stdout, 'base64').toString();
        console.log(plagResult);
        console.log("Plagiarism Check finished.");

        //Push to submission

        await updateSub(newSubID, {
            "grade":scoreVal,
            "results": child.stdout,
            "plage_grade":plagResult
        });

        //Return response

        res.status(200).send({
            "message": "Success",
            "newSubID": newSubID
        });

    }); //form.parse
});

async function getAssnCourse(assnID) {
    var fetchCols = ['assignments.id','assignments.course'];
    var submissionRow = await db('assignments')
        .select(fetchCols)
        .where({
        'assignments.id': assnID
        });
    return submissionRow;
}
async function createSub(subData) {
    // columns to fetch from DB
    var [id] = await db('submission').insert(subData);
    return id;
}

async function updateSub(subID, subData) {
    await db('submission').where('id', subID).update(subData);
}

async function getUnitTest(assnID) {
    // columns to fetch from DB
    var fetchCols = ['unit_tests.id','unit_tests.assnID','unit_tests.path'];

    var submissionRow = await db('unit_tests')
        .select(fetchCols)
        .where({
            'unit_tests.assnID': assnID
        })
    return submissionRow;
}

module.exports = router;