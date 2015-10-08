var virt = require("virt"),
    map = require("map"),
    css = require("css");


var AppPrototype;


module.exports = App;


function App(props, children, context) {
    var _this = this;
    
    virt.Component.call(this, props, children, context);
    
    this.state = {
        colors: [
            "Red",
            "Blue",
            "Green"
        ]
    };
    
    this.onDragStart = function(e) {
        return _this.__onDragStart(e);
    };
    this.onDrag = function(e) {
        return _this.__onDrag(e);
    };
    this.onDragEnd = function(e) {
        return _this.__onDragEnd(e);
    };
}
virt.Component.extend(App, "App");
AppPrototype = App.prototype;

AppPrototype.__onDragStart = function(e) {
    e.persist();
    console.log(e);
};

AppPrototype.__onDrag = function(e) {
    e.persist();
    console.log(e);
};

AppPrototype.__onDragEnd = function(e) {
    e.persist();
    console.log(e);
};

AppPrototype.render = function() {
    var _this = this,
        colorStyle = {
            cursor: "pointer",
        };
    
    css.userSelect(colorStyle, "none");
    
    return (
        virt.createView("div", {
                className: "app"
            },
            virt.createView("ul",
                map(this.state.colors, function(color) {
                    return (
                        virt.createView("li", {
                            style: colorStyle,
                            draggable: "true",
                            onDragStart: _this.onDragStart,
                            onDrag: _this.onDrag,
                            onDragEnd: _this.onDragEnd
                        }, color)
                    );
                })
            )
        )
    );
};
