var virt = require("virt"),
    propTypes = require("prop_types"),
    dispatcher = require("./dispatcher");


var LayoutTwoPrototype;


module.exports = LayoutTwo;


function LayoutTwo(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.onClick = function(e) {
        return _this.__onClick(e);
    };
}
virt.Component.extend(LayoutTwo, "LayoutTwo");
LayoutTwoPrototype = LayoutTwo.prototype;

LayoutTwo.contextTypes = {
    ctx: propTypes.object
};

LayoutTwoPrototype.__onClick = function() {
    dispatcher.handleViewAction({
        actionType: "ROUTE_STATE_CHANGE",
        state: "layout_one"
    });
};

LayoutTwoPrototype.render = function() {
    return (
        virt.createView("div", {
                className: "layout-two"
            },
            virt.createView("div", {
                    className: "wrap"
                },
                virt.createView("h1", "Layout Two"),
                virt.createView("a", {
                    href: "#",
                    onClick: this.onClick
                }, "View Layout One")
            )
        )
    );
};
