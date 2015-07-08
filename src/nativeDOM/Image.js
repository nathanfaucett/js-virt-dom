var virt = require("virt");


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

}
Component.extend(Image, "img");
ImagePrototype = Image.prototype;

ImagePrototype.render = function() {
    return new View("img", null, null, this.props, this.children, null, null);
};
