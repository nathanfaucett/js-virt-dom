virt DOM
=======

virt adapter for the DOM

```javascript
var virt = require("virt"),
    virtDOM = require("virt-dom");


function List(props, children, context) {
    virt.Component.call(this, props, children, context);

    this.state = {
        items: [
            {id: 0, text: "Item 1"},
            {id: 1, text: "Item 2"}
        ]
    };
}
// same as
// List.prototype = Object.create(virt.Component.prototype);
// List.prototype.displayName = "List";
virt.Component.extend(List, "List");

List.prototype.onClick = function(id) {
    var _this = this;

    this.state.items.forEach(function(value, index, array) {
        if (value.id === id) {
            array.splice(index, 1);
            _this.setState({
                items: array
            });
            return false;
        }
    });
};

List.prototype.render = function() {
    var _this = this;

    return (
        virt.createView("ul", this.state.items.map(function(item) {
            return virt.createView(Item, {
                key: item.id,
                onClick: function onClick() {
                    _this.onClick(item.id);
                },
                text: item.text
            });
        }));
    );
};

function Item(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(Item, "Item");

Item.prototype.render = function() {
    return (
        virt.createView("li", {
            onClick: this.props.onClick
        }, this.props.text);
    );
};

virtDOM.render(virt.createView(List), document.getElementById("app"));
```
