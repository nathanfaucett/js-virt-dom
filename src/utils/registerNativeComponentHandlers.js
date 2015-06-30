var has = require("has");


module.exports = registerNativeComponentHandlers;


function registerNativeComponentHandlers(messenger, nativeComponents) {
    var localHas = has,
        type, nativeComponent, nativeComponentHandlers, key;

    for (type in nativeComponents) {
        if (localHas(nativeComponents, type)) {
            nativeComponent = nativeComponents[type];

            if (localHas(nativeComponent, "handlers")) {
                nativeComponentHandlers = nativeComponent.handlers;

                for (key in nativeComponentHandlers) {
                    if (localHas(nativeComponentHandlers, key)) {
                        messenger.on(key, nativeComponentHandlers[key]);
                    }
                }
            }
        }
    }
}
