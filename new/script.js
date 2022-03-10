function addElement(location, type, values) {
    let element = document.createElement(type); // "script", "link"
    Object.entries(values).forEach(([key, value]) => {
        element.setAttribute(key, value); // element.src = value
    });
    document[location].appendChild(element);
    return element;
}

let jQuery = addElement("body", "script", { src: "//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js" }); // Add jquery

let css = addElement("head", "link", { rel: "stylesheet", href: "./style.css" }); // Add CSS

jQuery.addEventListener('load', () => {
    // Wait for jQuery to load then load script
    addElement("body", "script", { src: "./index.js" });
  })

/*
Full script (shortened)

function m(e,t,d){let s=document.createElement(t);Object.entries(d).forEach(([e,t])=>{s.setAttribute(e,t)}),document[e].appendChild(s)}m("body","script",{src:"//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"}),m("head","link",{rel:"stylesheet",href:"./style.css"}),setTimeout(()=>{m("body","script",{src:"./index.js"})},500);
*/
