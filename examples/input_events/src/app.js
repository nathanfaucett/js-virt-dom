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
                onClick: function(e) {
                    e.currentComponentTarget.getSelection(function(error, data) {
                        console.log(data);
                    });
                },
                onKeyDown: function(e) {
                    e.currentComponentTarget.getSelection(function(error, data) {
                        console.log(data);
                    });
                },
                onChange: function(e) {
                    _this.setState({
                        inputValue: e.target.value
                    });
                }
            }),
            virt.createView("input", {
                ref: "input",
                value: "Hello!"
            }),
            virt.createView("input", {
                ref: "input",
                value: null
            }),
            virt.createView("input", {
                type: "checkbox",
                checked: false
            }),
            
            virt.createView("input", {
                name: "yesOrNo",
                value: "yes",
                type: "radio"
            }),
            virt.createView("input", {
                name: "yesOrNo",
                value: "no",
                type: "radio"
            }),

            // textarea            
            virt.createView("textarea", {
                autoFocus: true
            })
        )
    );
};
