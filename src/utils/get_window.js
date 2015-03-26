module.exports = getWindow;


function getWindow(document) {
    var scriptElement, parentElement;

    if (document.parentWindow) {
        return document.parentWindow;
    } else {
        if (!document.defaultView) {
            scriptElement = document.createElement("script");
            scriptElement.innerHTML = "document.parentWindow=window;";

            parentElement = document.documentElement;
            parentElement.appendChild(scriptElement);
            parentElement.removeChild(scriptElement);

            return document.parentWindow;
        } else {
            return document.defaultView;
        }
    }
}
