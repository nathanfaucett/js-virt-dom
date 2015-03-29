var virt = require("virt"),
    virtDOM = require("../../../src/index"),
    eventListener = require("event_listener"),
    dispatcher = require("./dispatcher"),
    TodoStore = require("./todo_store");


var TodoFormPrototype;


module.exports = TodoForm;


function TodoForm(props, children) {
    var _this = this;

    virt.Component.call(this, props, children);

    this.onSubmit = function(e) {
        return _this.__onSubmit(e);
    };

    this.onChange = function(e) {
        return _this.__onChange(e);
    };
}
virt.Component.extend(TodoForm, "TodoForm");

TodoFormPrototype = TodoForm.prototype;

TodoFormPrototype.componentDidMount = function() {

};

TodoFormPrototype.componentWillUnmount = function() {

};

TodoFormPrototype.__onSubmit = function(e) {
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

TodoFormPrototype.__onChange = function(e) {
    console.log(e);
};

TodoFormPrototype.render = function() {
    return (
        virt.createView("div", {
                className: "todo-form"
            },
            virt.createView("form", {
                    onSubmit: this.onSubmit
                },
                virt.createView("input", {
                    type: "text",
                    name: "name",
                    ref: "name",
                    placeholder: "Todo",
                    onChange: this.onChange
                })
            )
        )
    );
};
