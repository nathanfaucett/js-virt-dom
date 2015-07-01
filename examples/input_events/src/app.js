var virt = require("virt");


var AppPrototype;


module.exports = App;


function App(props, children, context) {
    virt.Component.call(this, props, children, context);
    
    this.state = {
        inputValue: "Hello!"
    };
}
virt.Component.extend(App, "App");
AppPrototype = App.prototype;

AppPrototype.render = function() {
    var _this = this;
    return (
        virt.createView("div", {
                className: "app"
            },
            
            // buttons
            virt.createView("button", {
                disabled: true
            }, "Disabled Button"),
            virt.createView("button", {
            }, "Button"),
            
            // input
            virt.createView("input", {
                ref: "input",
                value: this.state.inputValue,
                onChange: function(e) {
                    _this.setState({
                        inputValue: e.target.value
                    });
                }
            }),
            virt.createView("input", {
                type: "checkbox",
                checked: false
            }),
            virt.createView("input", {
                type: "radio"
            }),

            // textarea            
            virt.createView("textarea", {
                autoFocus: true
            })
        )
    );
};