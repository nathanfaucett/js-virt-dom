virt DOM
=======

virt DOM is an render adapter for the [virt](https://github.com/nathanfaucett/virt) library, virt was created after reading facebook's [React](https://github.com/facebook/react) source code. The main difference is [virt](https://github.com/nathanfaucett/virt) creates changes as JSON that an adapter like virt-dom uses to render to some view system, in this case the DOM.

## Install using NPM

```bash
$ npm install git://github.com/nathanfaucett/virt-dom --save
```

## API

#### addNativeComponent(type: String, constructor: Function)
Adds new native component to virt-dom. Used by virt-dom to implement native elements like img, div, etc... needs to be called before rendering.

#### addNativeHandler(type: String, fn: Function)
Adds new native handler component to virt-dom. Used by virt-dom to implement native messages accross the messenger api.

#### render(view: View, containerDOMNode: DOMElement, [, callback: Function])
Renders the view to the dom element and calls the callback when it is done.

#### unmount(containerDOMNode: DOMElement)
Removes all data associated with the parent element given and removes it from the DOM.

#### renderString(view: View[, id: String]) -> String
Render view to string using the id given as the root id of the DOM elements, defaults to 0.

#### findDOMNode(value: View|String) -> DOMElement
Returns the DOMElement associated with the view or id givent by value.

#### findRoot(value: String) -> virt.Root
Returns the virt.Root associated with the id

#### findEventHandler(value: String) -> virt.EventHandler
Returns the virt.EventHandler associated with the id

#### createWorkerRender(url: String, containerDOMNode: DOMElement) -> Messenger
Returns the Messenger created to communicate with the workers view component. used on the client side

#### renderWorker(view: View[, callback: Function])
Creates a diff from the view and the last view, then sends it over the messenager api to the client created with virtDOM.createWorkerRender. Used on the server side.

#### createWebSocketRender(containerDOMNode: DOMElement, socket: WebSocket[, attachMessage: Function], [sendMessage: Function]) -> Messenger
Returns the Messenger created to communicate over the web socket to the view side. used on the client side

#### renderWebSocket(view: View, socket: WebSocket[, attachMessage: Function][, sendMessage: Function] [, callback: Function])
Creates a diff from the view and the last view, then sends it over the messenager api to the client created with virtDOM.createWebSocketRender. Used on the server side.

### Examples
Some technical examples can be found [here](http://nathanfaucett.github.io/virt-dom/)

###Usage

The best way to use virt is to create custom components that inherit from the virt.Component class.

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
