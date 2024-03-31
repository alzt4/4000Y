import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { dracula } from 'thememirror';
import { python } from "@codemirror/lang-python"
import axios, * as others from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


// import 'bootstrap/js';
import './css/viewSub.css';
//Fetch fileID from buttons
var fileButtons = document.querySelectorAll("[data-file]");
console.log(fileButtons);
// fetch the first file

var getFileResp = await axios({
    url: '/getFile',
    method: 'GET',
    params: {
        "fileID": fileButtons[0].dataset.file
    },
});

console.log(getFileResp);

const state = EditorState.create({
    doc: getFileResp.data,
    extensions: [
        dracula,
        lineNumbers(),
        python()
    ]
});
const view = new EditorView({ state });
document.querySelector('#editor').append(view.dom);
