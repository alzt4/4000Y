//Init setup

const express = require('express');
const path = require('path');
const fs = require('fs');
const sql = require('mysql');
const formidable = require('formidable');


//Make the webserver
const app = express();
const PORT = 8080; //Random port vals

app.set("view engine", "ejs");


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
con.connect((err) => {
    if (err) throw err;
    console.log("connected!");
    con.query(SQLStart, (err, result, fields) => {
        if(err) throw err;
        console.log(result);
        val = result;
    })
});




app.get('/', (req, res) => {

	res.render(path.join(__dirname, "FrontEnd/main.ejs"));
	console.log("ejs page sent, sending css");
	
	

}); //app.get

app.get('/style.css', (req, res) =>{
	
	res.sendFile(path.join(__dirname, "FrontEnd/style.css"), (err) => {
		if(err)
		{
			console.log(`Something went wrong: ${err}`, err);
		}
		else{
			console.log("CSS sent");
		}
	});//res.sendFile
});	//app.get('/style.css')

app.get('/MasterSrc.js', (req, res) => {

	res.sendFile(path.join(__dirname, "FrontEnd/MasterSrc.js"), (err) =>{
		if(err)
		{
			console.log(`Something went wrong with the Javascript: ${err}`, err);
		}
		else
		{
			console.log("Javascript sent")
		}
	});//res.sendFile

});//app.get('/script)


app.post('/api/upload', (req, res) => {
	
	const form = new formidable.IncomingForm(); //Get the form?
	form.parse(req, (err, fields, files) => {

		res.json({ fields, files });
		
		let oldpath = files.imageTest[0].filepath;
		let newpath = path.join(__dirname, 'uploads') + '\\' + files.imageTest[0].originalFilename;

		console.log(files);
		console.log(fields);

		console.log('\n\n split \n\n');

		console.log(oldpath);
		console.log(newpath);


		// let oldPath = files.profilePic.filepath;
		// let newPath = path.join(__dirname, 'uploads') + '/' + files.profilePic.name;
		// let rawdata = fs.readFileSync(oldPath);
		
		// fs.writeFile(newPath, rawdata, (err) => {
		// 	if(err) console.log(err);
			
		// 	console.log("upload successful");
		// 	return res.send('upload successful');
			
		// });//fs.writeFile

	}); //form.parse




}); //app.post



/*
	INSERT INTO Submissions VALUES (id, filename, size, NULL, hash, uploader, datetime, Edition, course, NULL, path);

*/



