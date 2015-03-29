var virt = require("virt"),
    getViewKey = require("virt/utils/get_view_key"),

    isFunction = require("is_function"),
    isArray = require("is_array"),
    map = require("map"),
    isString = require("is_string"),
    isObject = require("is_object"),
    isNullOrUndefined = require("is_null_or_undefined"),

    DOM_ID_NAME = require("../dom_id_name");


var View = virt.View,
    isPrimativeView = View.isPrimativeView,

    closedTags = {
        area: true,
        base: true,
        br: true,
        col: true,
        command: true,
        embed: true,
        hr: true,
        img: true,
        input: true,
        keygen: true,
        link: true,
        meta: true,
        param: true,
        source: true,
        track: true,
        wbr: true
    };


module.exports = function(view, id) {
    if (isArray(view)) {
        return map(view, function(v, i) {
            return render(v, id + "." + getViewKey(v, i));
        }).join("");
    } else {
        return render(view, id);
    }
};


function render(view, id) {
    var type;

    if (isPrimativeView(view)) {
        return view + "";
    } else {
        type = view.type;

        return (
            closedTags[type] !== true ?
            contentTag(type, map(view.children, function(child, i) {
                return render(child, id + "." + getViewKey(child, i));
            }).join(""), id, view.props) :
            closedTag(type, id, view.props)
        );
    }
}

function baseTagOptions(id, options) {
    var attributes = "",
        key, value;

    for (key in options) {
        value = options[key];

        if (!isNullOrUndefined(value) && !isFunction(value)) {
            if (key === "className") {
                key = "class";
            }

            if (isObject(value)) {
                attributes += baseTagOptions(value);
            } else {
                attributes += key + '="' + value + '" ';
            }
        }
    }

    return attributes;
}

function tagOptions(id, options) {
    var attributes = baseTagOptions(id, options);
    return attributes !== "" ? " " + attributes : attributes;
}

function dataId(id) {
    return ' ' + DOM_ID_NAME + '="' + id + '"';
}

function closedTag(type, id, options) {
    return "<" + type + (isObject(options) ? tagOptions(id, options) : "") + dataId(id) + "/>";
}

function contentTag(type, content, id, options) {
    return (
        "<" + type + (isObject(options) ? tagOptions(id, options) : "") + dataId(id) + ">" +
        (isString(content) ? content : "") +
        "</" + type + ">"
    );
}
