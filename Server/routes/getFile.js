// IMPORTS AND MIDDLEWARE / CONFIG
const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require('../db-config.js');

router.get('/', async function (req, res, next) {
    // Get FileID from GET params
    var fileID = req.query.fileID;
    console.log(fileID);
    // Fetch from DB
    filePath = await getFilePath(fileID);
    res.download(filePath);
});

module.exports = router;

async function getFilePath(subID) {
    // columns to fetch from DB
    var fetchCols = ['path'];
    var fileRow = await db('submission')
        .select(fetchCols)
        .where({
            'submission.id': subID
        });
    return fileRow[0].path;
}
  