

function addElement(location, type, values) {
    let element = document.createElement(type); // "script", "link"
    Object.entries(values).forEach(([key, value]) => {
        element.setAttribute(key, value); // element.src = value
    });
    document[location].appendChild(element);
    return element;
}

let jQuery = addElement("body", "script", {
    src: "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
}); // Add jquery

let css = addElement("head", "link", { rel: "stylesheet", href: "./style.css" }); // Add CSS

jQuery.onload = () => addElement("body", "script", { src: "./index.js" });

