var virt = require("@nathanfaucett/virt"),
    LayoutOne = require("./layout_one"),
    LayoutTwo = require("./layout_two");


var views = exports;


views.layout_one = function() {
    return virt.createView(LayoutOne);
};

views.layout_two = function() {
    return virt.createView(LayoutTwo);
};
