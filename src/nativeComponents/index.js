module.exports = {
    input: {
        type: "input",
        constructor: require("./Input"),
        handlers: require("./inputHandlers")
    },
    textarea: {
        type: "textarea",
        constructor: require("./TextArea"),
        handlers: require("./textareaHandlers")
    },
    button: {
        type: "button",
        constructor: require("./Button"),
        handlers: require("./buttonHandlers")
    }
};
