function addElement(location, type, values) {
    let element = document.createElement(type); // "script", "link"
    Object.entries(values).forEach(([key, value]) => {
        element.setAttribute(key, value); // element.src = value
    });
    document[location].appendChild(element);
    return element;
}

var jQuery = addElement("body", "script", {
    src: "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
    id: "jquery",
}); // Add jquery

var css = addElement("head", "link", { rel: "stylesheet", href: "./style.css" }); // Add CSS
var bootstrap = addElement("head", "link", {
    rel: "stylesheet",
    href: "https://bitofbeans.github.io/cssContainedBootstrap/4.6.1/bootstrap.min.css",
}); // Add Bootstrap

jQuery.onload = () => {
    let script = addElement("body", "script", { src: "./index.js", id: "index" });
    script.onload = () => {
        // Remove injection scripts
        document.querySelector("#script").remove();
        document.querySelector("#index").remove();
        document.querySelector("#jquery").remove();
    };
};
