var virt = require("virt"),
    getViewKey = require("virt/utils/get_view_key"),

    escapeTextContent = require("escape_text_content"),
    isFunction = require("is_function"),
    isArray = require("is_array"),
    map = require("map"),
    isString = require("is_string"),
    isObject = require("is_object"),
    isNullOrUndefined = require("is_null_or_undefined"),

    DOM_ID_NAME = require("../dom_id_name");


var View = virt.View,
    isPrimativeView = View.isPrimativeView,
    emptyProps = {},

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
    var props;
    if (isArray(view)) {
        props = view.props;
        return map(view, function(v, i) {
            return render(v, props, id + "." + getViewKey(v, i));
        }).join("");
    } else {
        return render(view, emptyProps, id);
    }
};


function render(view, parentProps, id) {
    var type, props;

    if (isPrimativeView(view)) {
        return isString(view) ? contentMarkup(view, parentProps) : view + "";
    } else {
        type = view.type;
        props = view.props;

        return (
            closedTags[type] !== true ?
            contentTag(type, map(view.children, function(child, i) {
                return render(child, props, id + "." + getViewKey(child, i));
            }).join(""), id, view.props) :
            closedTag(type, id, view.props)
        );
    }
}

function contentMarkup(content, props) {
    if (props.dangerouslySetInnerHTML !== true) {
        return escapeTextContent(content);
    } else {
        return content;
    }
}

function baseTagOptions(id, props) {
    var attributes = "",
        key, value;

    for (key in props) {
        if (key !== "dangerouslySetInnerHTML") {
            value = props[key];

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
    }

    return attributes;
}

function tagOptions(id, props) {
    var attributes = baseTagOptions(id, props);
    return attributes !== "" ? " " + attributes : attributes;
}

function dataId(id) {
    return ' ' + DOM_ID_NAME + '="' + id + '"';
}

function closedTag(type, id, props) {
    return "<" + type + (isObject(props) ? tagOptions(id, props) : "") + dataId(id) + "/>";
}

function contentTag(type, content, id, props) {
    return (
        "<" + type + (isObject(props) ? tagOptions(id, props) : "") + dataId(id) + ">" +
        (isString(content) ? content : "") +
        "</" + type + ">"
    );
}
