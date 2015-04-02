var virt = require("virt"),
    virtDOM = require("../../../src/index");


var app = document.getElementById("app");


function Top(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(Top, "Top");

Top.prototype.componentDidMount = function() {
    console.log("last");
};
Top.prototype.componentWillUnmount = function() {
    console.log("last");
};

Top.prototype.render = function() {
    return virt.createView(Bottom, this.props);
};


function Text(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(Text, "Text");

Text.prototype.componentDidMount = function() {
    console.log("first");
};
Text.prototype.componentWillUnmount = function() {
    console.log("first");
};

Text.prototype.render = function() {
    return virt.createView("div", {
            className: "text"
        },
        virt.createView("a", this.props.text)
    );
};


function Bottom(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(Bottom, "Bottom");

Bottom.prototype.componentDidMount = function() {
    console.log("middle");
};
Bottom.prototype.componentWillUnmount = function() {
    console.log("middle");
};

Bottom.prototype.render = function() {
    return virt.createView("div", {
            className: "bottom"
        },
        virt.createView(Text, this.props)
    );
};


virtDOM(virt.createView(Top, {
    text: "test 0"
}), app);
virtDOM(virt.createView(Top, {
    text: "test 1"
}), app);
virtDOM.unmount(app);
