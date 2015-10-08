var virt = require("virt"),
    has = require("has");


var View = virt.View,
    Component = virt.Component,
    ImagePrototype;


module.exports = Image;


function Image(props, children, context) {
    if (process.env.NODE_ENV !== "production") {
        if (children.length > 0) {
            throw new Error("Image: img can not have children");
        }
    }

    Component.call(this, props, children, context);

    this.__hasEvents = !!(props.onLoad || props.onError);
}
Component.extend(Image, "img");
ImagePrototype = Image.prototype;

ImagePrototype.componentDidMount = function() {
    this.emitMessage("virt.dom.Image.mount", {
        id: this.getInternalId(),
        src: this.props.src
    });
};

ImagePrototype.__getRenderProps = function() {
    var props = this.props,
        localHas, renderProps, key;

    if (!this.__hasEvents || this.isMounted()) {
        return props;
    } else {
        localHas = has;
        renderProps = {};

        for (key in props) {
            if (localHas(props, key) && key !== "src") {
                renderProps[key] = props[key];
            }
        }

        return renderProps;
    }
};

ImagePrototype.render = function() {
    return new View("img", null, null, this.__getRenderProps(), this.children, null, null);
};
