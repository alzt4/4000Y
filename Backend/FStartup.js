const path = require('path');
const fs = require('fs');

//Since I need the date for just about everything,
var date = new Date();

export function fsInit()
{
	//Making a completely new 

	let Home = __dirname; //
	var firstDir = date.getFullYear();
	
	fs.mkdirSync(Home + '/' + firstDir); //Should make the year directory

	console.log("First directory");
}

function Goto(Path)
{
	//Goes into the listed directory, makes it if it doesnt exist.
	let TmpPath = Path.split('/');
	let ChkPath = "";

	for(let i = 0; i < TmpPath.length-1; i++)
	{
		ChkPath = ChkPath + '/' + TmpPath[i];

		if(fs.existsSync(ChkPath))
		{
			//This is if the path exists
		}
		else{
			//gotta go make it
			mkdirTo(Path);
		}
	}
}


function mkdirTo(Path){
	//Path here is going to be a passed array 
	let tstpth = Path.split('/');
	let builtpath = "";

	for(let i = 0; i < tstpth.length; i++)
	{
		//run through the list, builds it, checks for if the next directory has been made, if so then it goes and tries the next directory after that.
		if(fs.existsSync(builtpath + "/" + tstpth[i]))
		{
			builtpath + '/' + tstpth[i];
			
		}
		else
		{
			//make directory then repeat
			fs.mkdirSync(builtpath + '/' + tstpth[i]);
		}
	}
}




/*
	Year
	L Semester
		L Course
			L Student
				L Student module
			L Student 2
				L Studetn module 2

		L Course 2
			L Student 3
				L Student module 3
			L Student 4
				L Student module 4

	L Semester 2
		L Course
			L Student  5
				L Student module 5

	Year 2
	L Semester
		L Course
			L Student
				L Student module
			L Student 2
				L Studetn module 2

		L Course 2
			L Student 3
				L Student module 3
			L Student 4
				L Student module 4

	L Semester 2
		L Course
			L Student  5
				L Student module 5
*/

