var extend = require("extend");


var nativeDOM = exports;


nativeDOM.components = {
    input: {
        type: "input",
        constructor: require("./Input")
    },
    textarea: {
        type: "textarea",
        constructor: require("./TextArea")
    },
    button: {
        type: "button",
        constructor: require("./Button")
    }
};

nativeDOM.handlers = extend({},
    require("./inputHandlers"),
    require("./textareaHandlers"),
    require("./buttonHandlers")
);
