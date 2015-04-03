var React = require("react");


var app = document.getElementById("app");


function Top(props, context) {
    React.Component.call(this, props, context);
}
Top.prototype = Object.create(React.Component.prototype);

Top.prototype.render = function() {
    return React.createElement(Bottom, null);
};


function Bottom(props, context) {
    React.Component.call(this, props, context);
}
Bottom.prototype = Object.create(React.Component.prototype);

Bottom.prototype.render = function() {
    return React.createElement("div", {
            className: "bottom"
        },
        React.createElement("p", null, "Bottom")
    );
};


React.render(React.createElement(Top, null), app);
