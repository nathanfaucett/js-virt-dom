var environment = require("@nathanfaucett/environment");


var document = environment.document;


if (
    (function() {
        try {
            var div = document.createElement("div");
            div.innerHTML = "<p>A</p>A<!-- -->";
            return div.children && div.children.length === 1;
        } catch (e) {}
        return false;
    }())
) {
    module.exports = true;
} else {
    module.exports = false;
}