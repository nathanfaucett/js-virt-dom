var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    dispatcher = require("./dispatcher"),

    views = require("./views");


var AppPrototype;


module.exports = App;


function App(props, children, context) {
    virt.Component.call(this, props, children, context);

    this.state = {
        viewState: "layout_one",
        render: views.layout_one
    };
}
virt.Component.extend(App, "App");
AppPrototype = App.prototype;

App.childContextTypes = {
    ctx: propTypes.object
};

AppPrototype.componentDidMount = function() {
    var _this = this;

    dispatcher.register(function(payload) {
        var action = payload.action;

        if (action.actionType === "ROUTE_STATE_CHANGE") {
            _this.setState({
                viewState: action.state,
                render: views[action.state]
            });
        }
    });
};

AppPrototype.getChildContext = function() {
    return {
        ctx: {
            pathname: location.pathname
        }
    };
};

AppPrototype.render = function() {
    return (
        virt.createView("div", {
                className: "app"
            },
            this.state.render()
        )
    );
};
