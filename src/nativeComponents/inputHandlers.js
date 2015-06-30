var sharedHandlers = require("./sharedHandlers");


var inputHandlers = exports;


inputHandlers["__Input:getValue__"] = sharedHandlers.getValue;
inputHandlers["__Input:setValue__"] = sharedHandlers.setValue;
inputHandlers["__Input:focus__"] = sharedHandlers.focus;
inputHandlers["__Input:blur__"] = sharedHandlers.blur;
