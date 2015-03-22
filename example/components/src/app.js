var virt = require("../../../virt"),
    TodoList = require("./todo_list");


module.exports = App;


function App(props, children) {
    virt.Component.call(this, props, children);
}
virt.Component.extend(App, "App");

App.prototype.render = function() {
    return (
        virt.createView("div", {
                className: "app"
            },
            virt.createView(TodoList)
        )
    );
};
