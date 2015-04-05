var virt = require("virt"),
    eventListener = require("event_listener"),
    dispatcher = require("./dispatcher"),
    TodoStore = require("./todo_store");


var TodoFormPrototype;


module.exports = TodoForm;


function TodoForm(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.state = {
        name: "Default State"
    };

    this.onSubmit = function(e) {
        return _this.__onSubmit(e);
    };

    this.onInput = function(e) {
        return _this.__onInput(e);
    };
}
virt.Component.extend(TodoForm, "TodoForm");

TodoFormPrototype = TodoForm.prototype;

TodoFormPrototype.componentDidMount = function() {

};

TodoFormPrototype.componentWillUnmount = function() {

};

TodoFormPrototype.__onSubmit = function(e) {
    var _this = this;

    this.emitMessage("TodoForm:onSubmit", this.refs.name.getId(), function(err, value) {
        if (!err && value) {
            dispatcher.handleViewAction({
                actionType: TodoStore.consts.TODO_CREATE,
                text: value
            });

            _this.setState({
                name: ""
            });
        }
    });
};

TodoFormPrototype.__onInput = function() {
    var _this = this;

    this.emitMessage("TodoForm:onInput", this.refs.name.getId(), function(err, value) {
        if (!err) {
            _this.setState({
                name: value
            });
        }
    });
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
                    value: this.state.name,
                    onInput: this.onInput
                })
            )
        )
    );
};
