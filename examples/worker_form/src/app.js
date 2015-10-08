var virt = require("virt"),
    propTypes = require("prop_types"),
    TodoList = require("./todo_list"),
    TodoForm = require("./todo_form");


var AppPrototype;


module.exports = App;


function App(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(App, "App");
AppPrototype = App.prototype;

App.childContextTypes = {
    ctx: propTypes.object
};

AppPrototype.getChildContext = function() {
    return {
        ctx: {
            pathname: location.pathname
        }
    };
};

AppPrototype.componentDidMount = function() {
    this.getHeight(function(error, height) {
        if (error) {
            console.log(error);
        } else {
            console.log(height);
        }
    });
    this.onMessage("virt.resize", function(data, callback) {
        console.log(data);
        callback();
    });
    this.sendMessage("virt.getDeviceDimensions", null, function(error, data) {
        console.log(data);
    });
};

AppPrototype.getHeight = function(callback) {
    this.emitMessage("worker_form.App.getHeight", {
        id: this.getInternalId()
    }, function(error, data) {
        if (error || !data.height) {
            callback(error);
        } else {
            callback(undefined, data.height);
        }
    });
};

AppPrototype.render = function() {
    return (
        virt.createView("div", {
                className: "app"
            },
            virt.createView("img", {
                onLoad: function(e) {
                    e.persist();
                    console.log(e);
                },
                src: "img.png"
            }),
            virt.createView(TodoForm),
            virt.createView(TodoList)
        )
    );
};
