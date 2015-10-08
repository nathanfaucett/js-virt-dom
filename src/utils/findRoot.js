var virt = require("virt"),
    isString = require("is_string"),
    rootsById = require("../rootsById");


var getRootIdFromId = virt.getRootIdFromId;


module.exports = findRoot;


function findRoot(value) {
    if (isString(value)) {
        return rootsById[getRootIdFromId(value)];
    } else {
        return null;
    }
}
