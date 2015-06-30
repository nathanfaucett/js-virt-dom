var sharedHandlers = require("./sharedHandlers");


var textareaHandlers = exports;


textareaHandlers["__TextArea:getValue__"] = sharedHandlers.getValue;
textareaHandlers["__TextArea:setValue__"] = sharedHandlers.setValue;
textareaHandlers["__TextArea:focus__"] = sharedHandlers.focus;
textareaHandlers["__TextArea:blur__"] = sharedHandlers.blur;
