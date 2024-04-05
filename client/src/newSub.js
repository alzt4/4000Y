import 'bootstrap/dist/css/bootstrap.min.css';
import axios, * as others from 'axios';

const form = document.getElementById("uploadForm");
const uploadButton = document.getElementById("fileUpload");
const submitButton = document.getElementById("submitAssn");
const uploadedTemplate = document.getElementById("fileAttachmentTemplate");
const fileUploadHolder = document.getElementById("fileList");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// attach event listener
uploadButton.addEventListener('change', uploadBtnAdd);
submitButton.addEventListener('click', async () => {
    await createSubmission();
});

console.log(uploadedTemplate);
// function to handle event listener call
function uploadBtnAdd() {
    var fileList = this.files;

    for (const file of fileList) {
        console.log(file);
        var fileItemSpan = uploadedTemplate.content.cloneNode(true);
        var spans = fileItemSpan.querySelectorAll("span");
        spans[0].textContent = file.name;
        spans[1].textContent = `${Math.round(file.size / 1024),1}kb`;
        fileUploadHolder.appendChild(fileItemSpan);
    }
    // console.log(fileList);
    document.getElementById("noFilePlaceHolder").classList.add('d-none');
}

//function to submit files
async function createSubmission() {

    var uploadSubFD = new FormData();
    for (var i = 0; i < uploadButton.files.length; i++) {
        uploadSubFD.append(`files[${i}]`, uploadButton.files[i]);
    }

    uploadSubFD.append("assignment_id", urlParams.get("assnID"));
    uploadSubFD.append("user_id", 0);

    console.log(uploadSubFD);

    //POST file to grading server

    var uploadFileResp = await axios.post('/api/upload', uploadSubFD, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    console.log(uploadFileResp.data.newSubID);

    // Simulate an HTTP redirect:
    window.location.replace(`/viewSubmission?subID=${uploadFileResp.data.newSubID}`);

    // console.log(uploadFileResp);
}

