// This is the javascipt code to be injected from bookmark
// javascript:
var jQuery = document.createElement('script');
var script = document.createElement('script');
jQuery.src = '//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
script.src = './index.js'; // Link for script
document.body.appendChild(jQuery);
setTimeout(() => {document.body.appendChild(script)}, 200); // Ensure jQuery is loaded

/*
javascript:var jQuery=document.createElement("script");var script=document.createElement("script");script.src="./index.js",jQuery.src="//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",document.body.appendChild(jQuery),setTimeout(()=>{document.body.appendChild(script)},100);
*/