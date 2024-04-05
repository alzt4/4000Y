import 'bootstrap/dist/css/bootstrap.min.css';
import axios, * as others from 'axios';


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const fileTemplate = document.getElementById("unitTemp");
const addReqTemplate = document.getElementById("reqAddTemp");

const unitTestsHolder = document.getElementById("unitTests");
const reqsHolder = document.getElementById("reqFiles");

const addReqBtn = document.querySelector("#addReqModal .btn-success");
const unitTestButton = document.getElementById("uploadUnit");
const submitBtn = document.getElementById("submitBtn");
const addUnitBtn = document.querySelector("#addUnitModal .btn-success");

const addModal = new bootstrap.Modal(document.getElementById('addReqModal'));
const unitModal = new bootstrap.Modal(document.getElementById('addUnitModal'));
const modalClose = document.querySelector("#addReqModal button[data-bs-dismiss=\"modal\"]");

addUnitBtn.addEventListener('click', addUnitTest);
unitTestButton.addEventListener('change', unitTestUpload);
addReqBtn.addEventListener('click', addReq);
modalClose.addEventListener('click', resetModal);
submitBtn.addEventListener('click', async () => {
    await submit();
});

function unitTestUpload() {
    var fileList = this.files;

    for (const file of fileList) {
        console.log(file);
        var fileItem = fileTemplate.content.cloneNode(true);
        var spans = fileItem.querySelectorAll("span");
        spans[0].textContent = file.name;
        unitTestButton.parentNode.classList.toggle('d-none');
        document.querySelector("#addUnitModal .modal-body").appendChild(fileItem);
    }

}

function addUnitTest() {
    
    var fileName = document.querySelector("#addUnitModal .list-group-item span");
    var uniTestName = document.querySelector("input[name=\"unitTestName\"]");
    //Clone template and sub values
    var unitItem = addReqTemplate.content.cloneNode(true);
    var spans = unitItem.querySelectorAll("span");
    spans[0].textContent = uniTestName.value;
    spans[1].textContent = fileName.innerHTML;

    spans[0].parentNode.setAttribute("data-unitName", uniTestName.value);
    unitTestsHolder.appendChild(unitItem);

    document.querySelector("button[data-bs-target=\"#addUnitModal\"]").classList.add("d-none");
    document.getElementById("fileUnitPh").classList.toggle('d-none');
    unitModal.hide();
}

function addReq() {
    //Get contents of modal, create req file item and close
    var reqFileName = document.querySelector("input[name=\"reqFileName\"]");
    var reqFileLang = document.querySelector("select[name=\"reqFileLang\"]");
    
    //Clone template and sub values
    var reqItem = addReqTemplate.content.cloneNode(true);
    console.log(reqFileLang);
    var spans = reqItem.querySelectorAll("span");
    spans[0].textContent = reqFileName.value;
    spans[1].textContent = reqFileLang[reqFileLang.value].innerText;


    spans[0].parentNode.setAttribute("data-reqName", reqFileName.value);
    spans[0].parentNode.setAttribute("data-reqLang", reqFileLang.value);

    reqsHolder.appendChild(reqItem);
    
    console.log(document.getElementById("fileUnitPh"));
    document.getElementById("fileReqPh").classList.add('d-none');

    //Clear and close
    reqFileName.value = ""
    reqFileLang.value = -1;

    addModal.hide();

}

function resetModal() {
    //FileName
    console.log(document.querySelector("input[name=\"reqFileName\"]").value);
    console.log(document.querySelector("select[name=\"reqFileLang\"]").value);

    
    //Clear and close
    document.querySelector("input[name=\"reqFileName\"]").value = ""
    document.querySelector("select[name=\"reqFileLang\"]").value = -1;
}

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
    for (var i = 0; i < unitTestButton.files.length; i++) {
        uploadAssnFD.append(`files[${i}]`, unitTestButton.files[i]);
        console.log(unitTestButton.files[i]);
    }

    var reqFilesArr = Array(); 
    reqFilesLi.forEach((reqFile) => {
        // console.log(reqFile.attributes["data-reqname"].value);
        // console.log(reqFile.attributes["data-reqlang"].value);
        reqFilesArr.push({
            "name": reqFile.attributes["data-reqname"].value,
            "lang": reqFile.attributes["data-reqlang"].value
        });
    });


    uploadAssnFD.append("assn_name", assnName.value);
    uploadAssnFD.append("course", urlParams.get("course"));
    uploadAssnFD.append("assn_descrip", assnDescrip.value);
    uploadAssnFD.append("maxScore", maxScore.value);
    uploadAssnFD.append("dueDate", dueDate.value);
    uploadAssnFD.append("professor", 0);
    uploadAssnFD.append("language", language[language.value].innerText);
    uploadAssnFD.append("reqFiles", JSON.stringify(reqFilesArr));
    uploadAssnFD.append("unitTest", unitTests[0].attributes["data-unitName"].value);

    console.log(uploadAssnFD);

    // POST to server
    var uploadFileResp = await axios.post('http://127.0.1.1:8021/api/createAssn', uploadAssnFD, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    console.log(uploadFileResp);

    window.location.replace(`/viewAssns?courseID=${ urlParams.get("course")}`);

   
    
}