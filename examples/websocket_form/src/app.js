var virt = require("@nathanfaucett/virt"),
    TodoList = require("./todo_list"),
    TodoForm = require("./todo_form");


var AppPrototype;


module.exports = App;


function App(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(App, "App");
AppPrototype = App.prototype;

AppPrototype.render = function() {
    return (
        virt.createView("div", {
                className: "app"
            },
            virt.createView("img", {
                onLoad: function(e) {
                    e.persist();
                },
                src: "img.png"
            }),
            virt.createView(TodoForm),
            virt.createView(TodoList)
        )
    );
};
