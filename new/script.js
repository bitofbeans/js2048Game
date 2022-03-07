let dependencies = ["//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"];

dependencies.forEach((url) => {
    // Add each dependency to the document
    let dependency = document.createElement("script");
    dependency.src = url;
    document.body.appendChild(dependency);
});

// Wait for all dependencies to load 
setTimeout(() => {
    // then load script
    let script = document.createElement("script");
    script.src = "./index.js";
    document.body.appendChild(script);
}, 200);
