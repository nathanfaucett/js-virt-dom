var has = require("has");


module.exports = registerNativeComponents;


function registerNativeComponents(root, nativeComponents) {
    var localHas = has,
        type, nativeComponent;

    for (type in nativeComponents) {
        if (localHas(nativeComponents, type)) {
            nativeComponent = nativeComponents[type];

            root.registerNativeComponent(
                nativeComponent.type,
                nativeComponent.constructor
            );
        }
    }
}
