var has = require("has");


module.exports = registerNativeComponents;


function registerNativeComponents(root, nativeDOMComponents) {
    var localHas = has,
        type, nativeComponent;

    for (type in nativeDOMComponents) {
        if (localHas(nativeDOMComponents, type)) {
            nativeComponent = nativeDOMComponents[type];

            root.registerNativeComponent(
                nativeComponent.type,
                nativeComponent.constructor
            );
        }
    }
}
