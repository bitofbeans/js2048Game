function addElementToDom(location, type, values) {
    let element = document.createElement(type); // "script", "link"
    Object.entries(values).forEach(([key, value]) => {
        element.setAttribute(key, value); // element.src = value
    });
    document[location].appendChild(element);
}

let dependencies = ["//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"];
dependencies.forEach((url) => {
    addElementToDom("body", "script", { src: url }); // Add each dependency to the document
});

addElementToDom("head", "link", { rel: "stylesheet", href: "./style.css" }); // Add CSS

// Wait for all dependencies to load
setTimeout(() => {
    addElementToDom("body", "script", { src: "./index.js" }); // then load script
}, 200);
