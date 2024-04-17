import 'bootstrap/dist/css/bootstrap.min.css';
import axios, * as others from 'axios';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const SubButton = document.getElementById('submitbtn'); //Go make sure this is actually a thing sooner or later

SubButton.addEventListener('click', async () => {
	await submit();
}); //End of eventlistener


async function submit(){
	//lots of query selectors here. idk what they all mean or what they're grabbing

	//Things we're actually updating. Name and description. Conveinietnly forgetting, like always that there isnt a description part of the database so idk what Kris as thinking with this but w/e

	var coursName = document.querySelector("input[name=\"courseName\"]"); //Getting a name query?
	var description = document.querySelector("textarea[name=\"CourseDesc\"]"); //updating the descriptiom. Maybe?


	var uploadCourseFD = new FormData();

	uploadCourseFD.append('crs_id', urlParams.get('courseID'));
	uploadCourseFD.append('crs_Name', coursName.value);
	uploadCourseFD.append('crs_Desc', description.value);

	var updateResp = await axios.post('http://127.0.1.1:8021/api/editCourse', uploadCourseFD, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
	});

	console.log(updateResp);

	window.location.replace(`/viewCourse?courseID=${urlParams.get("courseID")}`);

}