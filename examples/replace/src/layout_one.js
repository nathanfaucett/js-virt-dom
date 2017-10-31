var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    dispatcher = require("./dispatcher");


var LayoutOnePrototype;


module.exports = LayoutOne;


function LayoutOne(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.onClick = function(e) {
        return _this.__onClick(e);
    };
}
virt.Component.extend(LayoutOne, "LayoutOne");
LayoutOnePrototype = LayoutOne.prototype;

LayoutOne.contextTypes = {
    ctx: propTypes.object
};

LayoutOnePrototype.__onClick = function() {
    dispatcher.handleViewAction({
        actionType: "ROUTE_STATE_CHANGE",
        state: "layout_two"
    });
};

LayoutOnePrototype.render = function() {
    return (
        virt.createView("div", {
                className: "layout-one"
            },
            virt.createView("div", {
                    className: "wrap"
                },
                virt.createView("h1", "Layout One"),
                virt.createView("a", {
                    href: "#",
                    onClick: this.onClick
                }, "View Layout Two")
            )
        )
    );
};
