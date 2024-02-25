let button = document.getElementById("click");
var x = 0;
button.addEventListener('click', () => {x+=1; console.log(`Button clicked ${x} time(s)`);});