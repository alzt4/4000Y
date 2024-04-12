import 'bootstrap/dist/css/bootstrap.min.css';
import axios, * as others from 'axios';
//This this is where axios and the rest of the delete course stuff goes

const Delbutton = document.getElementById("DelButton"); //Getting the button to delete the course
const filebuttons = document.querySelectorAll("[data-file]");
var ID; //Idk how to get this value from the page itself.

Delbutton.addEventListener('click', Delete())


async function Delete()
{
	//Where the deletion will happen
	var DelResp = await axios({
		url:'/delete',
		method: 'GET',
		params:{
			"courseID": "1"//This amounts to a comment for now
		}
	});
	
	console.log(DelResp);
}