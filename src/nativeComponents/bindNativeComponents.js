var inputHandlers = require("./inputHandlers");


module.exports = bindNativeComponents;


function bindNativeComponents(messenger) {
    messenger.on("__Input:getValue__", inputHandlers.getValue);
    messenger.on("__Input:setValue__", inputHandlers.setValue);

    messenger.on("__Input:focus__", inputHandlers.focus);
    messenger.on("__Input:unfocus__", inputHandlers.unfocus);

    messenger.on("__TextArea:getValue__", inputHandlers.getValue);
    messenger.on("__TextArea:setValue__", inputHandlers.setValue);

    messenger.on("__TextArea:focus__", inputHandlers.focus);
    messenger.on("__TextArea:unfocus__", inputHandlers.unfocus);
}
