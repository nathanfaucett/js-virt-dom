var sharedHandlers = require("./sharedHandlers");


var buttonHandlers = exports;


buttonHandlers["__Button:focus__"] = sharedHandlers.focus;
buttonHandlers["__Button:blur__"] = sharedHandlers.blur;
