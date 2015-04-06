var getChildKey = require("virt/utils/get_child_key"),
    map = require("map"),
    renderString = require("./render_string");



module.exports = renderChildrenString;


function renderChildrenString(children, props, id) {
    return map(children, function(view, index) {
        return renderString(view, props, getChildKey(id, view, index));
    });
}
