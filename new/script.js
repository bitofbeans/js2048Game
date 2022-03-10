function addElement(location, type, values) {
    let element = document.createElement(type); // "script", "link"
    Object.entries(values).forEach(([key, value]) => {
        element.setAttribute(key, value); // element.src = value
    });
    document[location].appendChild(element);
}

addElement("body", "script", { src: "//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js" }); // Add jquery

addElement("head", "link", { rel: "stylesheet", href: "./style.css" }); // Add CSS

setTimeout(() => {
    // Wait for all dependencies to load then load script
    addElement("body", "script", { src: "./index.js" });
}, 500);

/*

Full script (shortened)

function m(e,t,d){let s=document.createElement(t);Object.entries(d).forEach(([e,t])=>{s.setAttribute(e,t)}),document[e].appendChild(s)}m("body","script",{src:"//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"}),m("head","link",{rel:"stylesheet",href:"./style.css"}),setTimeout(()=>{m("body","script",{src:"./index.js"})},500);
*/
