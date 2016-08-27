var virt = require("@nathanfaucett/virt"),
    isString = require("@nathanfaucett/is_string"),
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