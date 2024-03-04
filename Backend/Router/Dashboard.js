//The router page for the Dash/test page
//For showing off how its meant to work.
//Like practical documentation :>

const express = require('express');
const path = require('path');
const formidable = require('formidable');
const fs =require('fs');

const router = express.Router();


router.get('/', (req, res) => {

	res.render('../FrontEnd/main.ejs');
	console.log("ejs page sent, sending css");
})

//presumably this is where I put all the page forwarding code.
router.get('/style.css', (req, res) =>{
	
	res.sendFile(path.join(__dirname, '../FrontEnd/style.css'), (err) => {
		if(err)
		{
			console.log(`Something went wrong: ${err}`, err);
		}
		else{
			console.log("CSS sent");
		}
	});//res.sendFile
});	//app.get('/style.css')

router.get('/MasterSrc.js', (req, res) => {

	res.sendFile(path.join(__dirname,'../FrontEnd/MasterSrc.js'), (err) =>{
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


router.post('/api/upload', (req, res) => {
	
	const form = new formidable.IncomingForm(); //Get the form?
	form.parse(req, (err, fields, files) => {

		res.json({ fields, files });
		
		let oldpath = files.imageTest[0].filepath;
		let newpath = './uploads' + '\\' + files.imageTest[0].originalFilename;.

		let rawdata = fs.readFileSync(oldpath); //This is getting the data of the file from temp


		fs.writeFile(newpath, rawdata, (err) => {	//Writing the file into the "uploads" directory, which will be changed depending on user, course, and assignment.
			if (err) console.log(err);				//The User should have no control over where the file is uploaded to other than the selection of the course and assignment they're uploading to, which can be controlled through the UI

			console.log("Files successful");
		})


	}); //form.parse




}); //app.post



module.exports = router;