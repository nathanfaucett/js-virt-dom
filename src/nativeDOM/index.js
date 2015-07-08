var extend = require("extend");


var nativeDOM = exports;


nativeDOM.components = {
    input: require("./Input"),
    textarea: require("./TextArea"),
    button: require("./Button"),
    img: require("./Image")
};

nativeDOM.handlers = extend({},
    require("./inputHandlers"),
    require("./textareaHandlers"),
    require("./buttonHandlers")
);
