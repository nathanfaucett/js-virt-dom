var virt = require("../../../src/index"),
    propTypes = require("prop_types");


var TodoItemPrototype;


module.exports = TodoItem;


function TodoItem(props, children) {
    virt.Component.call(this, props, children);
}
virt.Component.extend(TodoItem, "TodoItem");

TodoItemPrototype = TodoItem.prototype;

TodoItem.propTypes = {
    id: propTypes.number.isRequired,
    text: propTypes.string.isRequired
};

TodoItemPrototype.render = function() {
    return (
        virt.createView("div", {
                id: this.props.id,
                className: "todo-item"
            },
            virt.createView("p", this.props.text)
        )
    );
};
