var extend = require("extend");


var handlers = exports;


extend(
    handlers,
    require("./buttonHandlers"),
    require("./imageHandlers"),
    require("./inputHandlers"),
    require("./textareaHandlers")
);
