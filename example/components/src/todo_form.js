var virt = require("../../../virt"),
    virtDOM = require("../../../src/index"),
    eventListener = require("event_listener"),
    dispatcher = require("./dispatcher"),
    TodoStore = require("./todo_store");


var TodoListPrototype;


module.exports = TodoList;


function TodoList(props, children) {
    var _this = this;

    virt.Component.call(this, props, children);

    this.onSubmit = function(e) {
        return _this.__onSubmit(e);
    };
}
virt.Component.extend(TodoList, "TodoList");

TodoListPrototype = TodoList.prototype;

TodoListPrototype.componentDidMount = function() {
    var DOMNode = virtDOM.findDOMNode(this);
    eventListener.on(DOMNode.childNodes[0], "submit", this.onSubmit);
};

TodoListPrototype.componentWillUnmount = function() {
    var DOMNode = virtDOM.findDOMNode(this);
    eventListener.off(DOMNode.childNodes[0], "submit", this.onSubmit);
};

TodoListPrototype.__onSubmit = function(e) {
    var DOMNode = virtDOM.findDOMNode(this).childNodes[0].childNodes[0],
        value = DOMNode.value;

    e.preventDefault();

    if (value) {
        dispatcher.handleViewAction({
            actionType: TodoStore.consts.TODO_CREATE,
            text: value
        });
        DOMNode.value = "";
    }
};

TodoListPrototype.render = function() {
    return (
        virt.createView("div", {
                className: "todo-form"
            },
            virt.createView("form",
                virt.createView("input", {
                    type: "text",
                    name: "name",
                    placeholder: "Todo"
                })
            )
        )
    );
};
