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
    
        assnData={
        "name": fields.assn_name[0],
        "overview": fields.assn_descrip[0],
        "due": fields.dueDate[0],
        "professor": fields.professor[0],
        "language": fields.language[0],
        "maxScore":fields.maxScore[0]
        }

        var editedAssnID = await updateAssn(assnData, fields.assn_id[0]);
        
        res.status(200).send({
            "message": "Success",
        });

    });

});

async function updateAssn(assnData,assnID) {
    console.log(assnData);
    // columns to fetch from DB
    var id = await db('assignments')
        .where("id", assnID)
        .update(assnData);
    return id;
}

module.exports = router;