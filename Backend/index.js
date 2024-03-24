//Init setup

const express = require('express');
const path = require('path');
const fs = require('fs');
const sql = require('mysql');

var date = new Date();

//import * as test from "./FStartup.js";

//Make the webserver
const app = express();
//const router = express.router(); //Starting the routing.
const PORT = 8080; //Random port vals

app.set("view engine", "ejs");


//fsInit();
var ChkDate = new Date("May 1, 20"); //This is going to be the date that needs to be checked next

TimeCheck(ChkDate);


//setTimeout(TimeCheck(), ChkDate);

//----

const dash = require("./Router/Dashboard.js");
const { start } = require('repl');

app.use('/', dash);
app.use('/MasterSrc.js', dash);
app.use('/style.css', dash);
app.use('/api/upload', dash);

//----


//opening ports, waiting for connection
app.listen(PORT, ()=> console.log(`Server is up and running on port: ${PORT}`, PORT));

//Establihsing connection to database, getting all users registered
let SQLStart = "SELECT * FROM users"; //Get all command

//DB info
/*
host: Where the DB is located. Currently Localhost
user: myphpadmin user to search for the DB
password: the required password to obtain access. Ideally not hardcoded but similarly not required for each access to the DB
database: specific database that we are looking to pull information from within the specified users listed DB's
*/
let con = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'submitly'
});

//Connecting with DB, getting test query results and printing.
let val;




//Try connecting to DB, on error, inform, else, display
try{
	con.connect(()=>{

		try{
			con.query(SQLStart, (err, result, fields) => {
				//if(err) throw err;
				if(result != undefined)
				{
					console.log("connected!");
					console.log(result);
				}
				val = result;
			});
		}
		catch(err){

			console.log("Something went wrong: ")
			console.log(err)
		}
	})
}
catch(err){
	
	console.log("Something went wrong: ");
	console.log(err);
	

}

//----------------------------------------------------------------------------


function fsInit()
{
	//Making a completely new 

	let Home = __dirname; //
	var year, Fyear;
	year = date.getFullYear();
	Fyear = date.getFullYear() + 1;
	
	fs.mkdirSync(Home + '/' + year + '-' + Fyear); //Should make the year directory

	let tmpdate = date.getMonth(); //Find out which semester we're in. Really this should happen first.
	if(tmpdate >= 1)
	{
		//Second semester, do year previous and current yet
	}
	else if(tmpdate > 4 && tmpdate < 8)
	{
		//Summer semester, use current year
	}
	else if(tmpdate >= 9)
	{
		//Start of new academic year
	}

	console.log("First directory");
}



function TimeCheck(Now){
	//This is going to be running to check and see if the date has changed, things can be stored in

	var nDate, tmpDate;
	var year; //Elements that change based on the time alone
//, month
	year = Now.getFullYear(); 	// Getting the year that we want to check against
	month = ChkDate.getMonth();		// Getting the month that we want to chekc against

/* 
	month 8 = Fall + new year.
	month 0 = winter
	month 4 = summer
*/

	if(month == 8)
	{
		let tmp = __dirname + '/' + `${year}-${year+1}` + '/' + "Fall";
		fs.mkdirSync(tmp, {recursive: true});
		//New Year folder set + semester (Fall) folders
		//check for folder
			//Make if not there
	}
	else if(month == 0)
	{
		//New semester (Winter)
		let tmpPath = __dirname + '/' + `${year}-${year+1}` + '/' + "Winter";
		if(fs.existsSync(tmpPath))
		{
			
		}
		else{ fs.mkdirSync(tmpPath, {recursive: true});} //otherwise, make it
	}
	else if(month == 4)
	{
		//new semester (Summer)
		let tmpPath = __dirname + '/' + `${year}-${year+1}` + '/' + "Summer";
		if(fs.existsSync(tmpPath))
		{
			//rad shit
		}
		else {fs.mkdirSync(tmpPath, {recursive: true});} //Otherwise, make it
	}



	let x = ChkDate.getFullYear();
	//After everything, get the current month, add 1 to it, and set that to be when we next check
	if(x == 11){
		nDate = new Date(x + 1, (ChkDate.getMonth() + 1) % 12, 1); //Next month on the first
	}
	else
		nDate = new Date(x, (ChkDate.getMonth() + 1) % 12, 1); //Next month on the first

	//month change = semester
	//month change + year = academic year
}

function dirCheck(startpth, dir)
{
	//Checks for a directory within a pth

	let tmppth = startpth + '/' + dir;

	if(fs.existsSync(tmppth)){
		return 0;
	}
	else{
		return 1;
	}
}

/*/-----------------/

	For Checking year, startpth is "root"
	For Checking month, startpth is year
	For Checking course, startpth is month/semester
	For Checking student, startpath is course

/------------------*/


// con.connect((err) => {
//     if (err) throw err;
//     console.log("connected!");
//     con.query(SQLStart, (err, result, fields) => {
//         if(err) throw err;
//         console.log(result);
//         val = result;
//     })
// });








/*
	INSERT INTO Submissions VALUES (id, filename, size, NULL, hash, uploader, datetime, Edition, course, NULL, path);

*/



