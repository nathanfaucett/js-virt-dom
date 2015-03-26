var virt = require("virt"),
    TodoList = require("./todo_list"),
    TodoForm = require("./todo_form");


module.exports = App;


function App(props, children) {
    virt.Component.call(this, props, children);
}
virt.Component.extend(App, "App");

App.prototype.render = function() {
    return (
        virt.createView("div", {
                onClick: function(e) {
                    console.log(e);
                },
                className: "app"
            },
            virt.createView(TodoForm),
            virt.createView(TodoList)
        )
    );
};
