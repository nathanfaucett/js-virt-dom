var extend = require("extend");


var handlers = extend({},
    require("./buttonHandlers"),
    require("./imageHandlers"),
    require("./inputHandlers"),
    require("./textareaHandlers")
);


module.exports = handlers;
