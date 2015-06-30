var findDOMNode = require("../utils/findDOMNode"),
    sharedHandlers = require("./sharedHandlers");


var inputHandlers = exports;


inputHandlers["__Input:getValue__"] = sharedHandlers.getValue;
inputHandlers["__Input:setValue__"] = sharedHandlers.setValue;
inputHandlers["__Input:focus__"] = sharedHandlers.focus;
inputHandlers["__Input:blur__"] = sharedHandlers.blur;


inputHandlers["__Input:setChecked__"] = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        if (data.checked) {
            node.setAttribute("checked", true);
        } else {
            node.removeAttribute("checked");
        }
        callback();
    } else {
        callback(new Error("setChecked(value, callback): No DOM node found with id " + data.id));
    }
};
