var virt = require("virt"),
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
    onDestroy: propTypes.func.isRequired,
    text: propTypes.string.isRequired
};

TodoItemPrototype.render = function() {
    return (
        virt.createView("div", {
                id: this.props.id,
                className: "todo-item"
            },
            virt.createView("p",
                this.props.text,
                virt.createView("span", {
                    onClick: this.props.onDestroy
                }, " x ")
            )
        )
    );
};
