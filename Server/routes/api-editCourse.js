const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const db = require('../db-config.js');

router.post('/', function (req, res, next) {

    const form = new formidable.IncomingForm(); //Get the form?
    form.parse(req, async (err, fields, files) => {
        console.log(fields);

        //Create and catch created assignment
    
		/*
			Elements that are to be updated.

			name
			desc (?)
		*/

        crsData={
			"name": fields.crs_Name[0],
			"Desc": fields.crs_Desc[0]
        }

        var editedCourseID = await updateCourse(crsData, fields.crs_id[0]);
        
        res.status(200).send({
            "message": "Success",
        });

    });

});

async function updateCourse(crsData,crsID) {
    console.log(crsData);
    // columns to fetch from DB
    var id = await db('courses')
        .where("id", crsID)
        .update(crsData);
    return id;
}

module.exports = router;