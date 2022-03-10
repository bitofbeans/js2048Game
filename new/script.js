function addElement(location, type, values) {
    let element = document.createElement(type); // "script", "link"
    Object.entries(values).forEach(([key, value]) => {
        element.setAttribute(key, value); // element.src = value
    });
    document[location].appendChild(element);
}

let dependencies = ["//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"];
dependencies.forEach((url) => {
    addElement("body", "script", { src: url }); // Add each dependency to the document
});
addElement("head", "link", { rel: "stylesheet", href: "./style.css" }); // Add CSS

// Wait for all dependencies to load
setTimeout(() => {
    addElement("body", "script", { src: "./index.js" }); // then load script
}, 500);

/*

Full script (shortened)

function m(e,t,s){let c=document.createElement(t);Object.entries(s).forEach(([e,t])=>{c.setAttribute(e,t)}),document[e].appendChild(c)}let x=["//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"];x.forEach(e=>{m("body","script",{src:e})}),m("head","link",{rel:"stylesheet",href:"./style.css"}),setTimeout(()=>{m("body","script",{src:"./index.js"})},200);

*/
