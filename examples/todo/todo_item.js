var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types");


var TodoItemPrototype;


module.exports = TodoItem;


function TodoItem(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(TodoItem, "TodoItem");

TodoItemPrototype = TodoItem.prototype;

TodoItem.propTypes = {
    id: propTypes.string.isRequired,
    onDestroy: propTypes.func.isRequired,
    text: propTypes.string.isRequired
};

TodoItemPrototype.render = function() {
    return (
        virt.createView("li", {
                id: this.props.id,
                className: "todo-item"
            },
            virt.createView("p", {
                dangerouslySetInnerHTML: "<span>" + this.props.text + "</span>"
            }),
            virt.createView("button", {
                onClick: this.props.onDestroy
            }, " x ")
        )
    );
};
