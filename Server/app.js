//Init setup

const express = require('express');
const cors = require('cors');
var path = require('path');
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");

//Import Routes
var uploadRoute = require('./routes/upload');
var createAssnRoute = require('./routes/createAssn');
var viewSubRoute = require('./routes/viewSubmission');
var getFileRoute = require('./routes/getFile');
var assnSubHomeRoute = require('./routes/assnSubHome');
var createSubRoute = require('./routes/createSub');
var newAssnRoute = require('./routes/newAssn');
var manageCoursesRoute = require('./routes/manageCourses');
var newCourseRoute = require('./routes/newCourse');
var editCourseRoute = require('./routes/editCourse');
var instructorHomeRoute = require('./routes/instructorHome');
var viewCourseRoute = require('./routes/viewCourse');

//Make the webserver
const app = express();
const PORT = 8080; //Random port vals
var liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "../client"));
app.use(express.static(path.join(__dirname, '../client')));
app.use(connectLiveReload());

app.use('/js', express.static(path.join(__dirname, '../client/dist/js')));
app.set('views', path.join(__dirname, '../client/dist/'));

app.set("view engine", "ejs");
app.use(cors({
    origin: '*'
}));

//Set Routing
app.use('/api/upload', uploadRoute);
app.use('/api/createAssn', createAssnRoute);
app.use('/viewSubmission', viewSubRoute);
app.use('/getFile', getFileRoute);
app.use('/assnSubHome', assnSubHomeRoute);
app.use('/newSub', createSubRoute);
app.use('/newAssn', newAssnRoute);
app.use('/manageCourses', manageCoursesRoute);
app.use('/newCourse', newCourseRoute);
app.use('/editCourse', editCourseRoute);
app.use('/instructorHome', instructorHomeRoute);
app.use('/viewCourse', viewCourseRoute);

//opening ports, waiting for connection
app.listen(PORT, () => console.log(`Server is up and running on port: ${PORT}`, PORT));


