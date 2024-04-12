import 'bootstrap/dist/css/bootstrap.min.css';
import axios, * as others from 'axios';

const SubBut = document.getElementsByClassName('btn-success');

const Name = document.getElementById('CourseName');
const desc = document.getElementById('CourseDesc');

SubBut.addEventListener('click', update());

async function update()
{
	var UpResp = await axios({
		url:"/update",
		method:"GET",
		params:{
			'name':Name,
			'desc':desc
		}
	});

	console.log(UpResp);
}
