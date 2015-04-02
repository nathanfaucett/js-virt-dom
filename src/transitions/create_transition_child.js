var View = require("virt/view"),
    owner = require("virt/owner"),
    context = require("virt/context");


module.exports = createTransitionChild;


function createTransitionChild(child, key, ref) {
    return new View(child.type, key, ref, child.props, child.children, owner.current, context.current);
}
