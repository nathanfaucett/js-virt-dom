var inputHandlers = require("./input_handlers");


module.exports = bindNativeComponents;


function bindNativeComponents(messenger) {
    messenger.on("__Input:getValue__", inputHandlers.getValue);
    messenger.on("__Input:setValue__", inputHandlers.setValue);
}
