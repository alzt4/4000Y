import 'bootstrap/dist/css/bootstrap.min.css';
import axios, * as others from 'axios';


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const submitBtn = document.getElementById("submitBtn");


submitBtn.addEventListener('click', async () => {
    await submit();
});

async function submit() {
    //Get all required files
    var reqFilesLi = document.querySelectorAll("#reqFiles li:not(#fileReqPh)");
    //Get unit tests
    var unitTests = document.querySelectorAll("#unitTests li:not(#fileUnitPh)");

    //Get the inputs
    var assnName = document.querySelector("input[name=\"assnName\"]");
    var assnDescrip = document.querySelector("textarea[name=\"assnDescrip\"]");
    var maxScore = document.querySelector("input[name=\"maxScore\"]");
    var dueDate = document.querySelector("input[name=\"dueDate\"]");
    var language = document.querySelector("select[name=\"assnLang\"]");
    // console.log(assnName.value);
    // console.log(assnDescrip.value);
    // console.log(maxScore.value);
    // console.log(dueDate.value);

    //Put together FormData
    var uploadAssnFD = new FormData();
    // for (var i = 0; i < unitTestButton.files.length; i++) {
    //     uploadAssnFD.append(`files[${i}]`, unitTestButton.files[i]);
    //     console.log(unitTestButton.files[i]);
    // }
    console.log(urlParams);
    uploadAssnFD.append("assn_id", urlParams.get("assnID"));
    uploadAssnFD.append("assn_name", assnName.value);
    uploadAssnFD.append("assn_descrip", assnDescrip.value);
    uploadAssnFD.append("maxScore", maxScore.value);
    uploadAssnFD.append("dueDate", dueDate.value);
    uploadAssnFD.append("professor", 0);
    uploadAssnFD.append("language", language[language.value].innerText);

    console.log(uploadAssnFD);

    // POST to server
    var updateResp = await axios.post('http://127.0.1.1:8021/api/editAssn', uploadAssnFD, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    console.log(updateResp);

    // Simulate an HTTP redirect:
    window.location.replace(`/viewAssns?courseID=${urlParams.get("courseID")}`);
    
}