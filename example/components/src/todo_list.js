var virt = require("virt"),
    map = require("map"),
    dispatcher = require("./dispatcher"),
    TodoStore = require("./todo_store"),
    TodoItem = require("./todo_item");


var TodoListPrototype;


module.exports = TodoList;


function TodoList(props, children) {
    var _this = this;

    virt.Component.call(this, props, children);

    this.state = {
        list: []
    };

    this.onChange = function() {
        _this.__onChange();
    };
}
virt.Component.extend(TodoList, "TodoList");

TodoListPrototype = TodoList.prototype;

TodoListPrototype.__onChange = function() {
    var _this = this;

    TodoStore.all(function(err, todos) {
        _this.setState({
            list: todos
        });
    });
};

TodoListPrototype.componentDidMount = function() {
    TodoStore.addChangeListener(this.onChange);
    this.onChange();
};

TodoListPrototype.componentWillUnmount = function() {
    TodoStore.removeChangeListener(this.onChange);
};

TodoListPrototype.render = function() {
    return (
        virt.createView("div", {
                className: "todo-list"
            },
            map(this.state.list, function(item) {
                return virt.createView(TodoItem, {
                    key: item.id,
                    id: item.id,
                    text: item.text
                });
            })
        )
    );
};
