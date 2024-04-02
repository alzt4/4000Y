const { spawn, spawnSync } = require('child_process');

args = [
    '/home/osboxes/Desktop/4000Y/4000Y/Docker/Scripts/runDockerCpp.sh',
    '/home/osboxes/Desktop/4000Y/4000Y/files/unit_tests/15/unit_test.cpp',
    '/home/osboxes/Desktop/4000Y/4000Y/files/submissions/4795/'
];

// var child = spawn("sudo", args, { encoding: 'utf8' });
// console.log("Unit Test finished.");
// if (child.error) {
//     console.log("ERROR: ", child.error);
// }

var child = spawn("sudo", args);

// You can also use a variable to save the output 
// for when the script closes later
var scriptOutput = "";

child.stdout.setEncoding('utf8');
child.stdout.on('data', function(data) {
    //Here is where the output goes

    console.log('stdout: ' + data);

    data=data.toString();
    scriptOutput+=data;
});

child.stderr.setEncoding('utf8');
child.stderr.on('data', function(data) {
    //Here is where the error output goes

    console.log('stderr: ' + data);

    data=data.toString();
    scriptOutput+=data;
});

child.on('close', function(code) {
    //Here you can get the exit code of the script

    console.log('closing code: ' + code);

    console.log('Full output of script: ',scriptOutput);
});