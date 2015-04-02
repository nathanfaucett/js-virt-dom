var virt = require("virt"),
    extend = require("extend"),
    forEach = require("for_each"),
    emptyFunction = require("empty_function"),
    createTransitionChild = require("./create_transition_child"),
    getChildMapping = require("./get_child_mapping"),
    mergeChildMappings = require("./merge_child_mappings");


var TransitionGroupPrototype;


module.exports = TransitionGroup;


function TransitionGroup(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    props.tagName = props.tagName || "span";
    props.childFactory = props.childFactory || emptyFunction.thatReturnsArgument;

    this.currentlyTransitioningKeys = {};
    this.keysToEnter = [];
    this.keysToLeave = [];

    this.state = {
        children: getChildMapping(children)
    };

    this.performEnter = function(key) {
        return _this.__performEnter(key);
    };
    this.performLeave = function(key) {
        return _this.__performLeave(key);
    };
}
virt.Component.extend(TransitionGroup, "TransitionGroup");

TransitionGroupPrototype = TransitionGroup.prototype;

TransitionGroupPrototype.componentWillReceiveProps = function(nextProps, nextChildren) {
    var nextChildMapping = getChildMapping(nextChildren),
        prevChildMapping = this.state.children,
        currentlyTransitioningKeys = this.currentlyTransitioningKeys,
        keysToEnter = this.keysToEnter,
        keysToLeave = this.keysToLeave,
        key;

    for (key in nextChildMapping) {
        if (
            nextChildMapping[key] &&
            !(prevChildMapping && !!prevChildMapping[key]) &&
            !currentlyTransitioningKeys[key]
        ) {
            keysToEnter[keysToEnter.length] = key;
        }
    }

    for (key in prevChildMapping) {
        if (
            prevChildMapping[key] &&
            !(nextChildMapping && !!nextChildMapping[key]) &&
            !currentlyTransitioningKeys[key]
        ) {
            keysToLeave[keysToLeave.length] = key;
        }
    }

    this.setState({
        children: mergeChildMappings(prevChildMapping, nextChildMapping)
    });
};

TransitionGroupPrototype.componentDidUpdate = function() {
    var keysToEnter = this.keysToEnter,
        keysToLeave = this.keysToLeave;

    this.keysToEnter = [];
    forEach(keysToEnter, this.performEnter);

    this.keysToLeave = [];
    forEach(keysToLeave, this.performLeave);
};

TransitionGroupPrototype.__performEnter = function(key) {
    var _this = this,
        component = this.refs[key];

    this.currentlyTransitioningKeys[key] = true;

    if (component.componentWillEnter) {
        component.componentWillEnter(function() {
            return _this.__handleEnterDone(key);
        });
    } else {
        this.__handleEnterDone(key);
    }
};

TransitionGroupPrototype.__handleEnterDone = function(key) {
    var component = this.refs[key],
        currentChildMapping;

    if (component.componentDidEnter) {
        component.componentDidEnter();
    }

    delete this.currentlyTransitioningKeys[key];
    currentChildMapping = getChildMapping(this.children);

    if (!currentChildMapping || !currentChildMapping[key]) {
        this.__performLeave(key);
    }
};

TransitionGroupPrototype.__performLeave = function(key) {
    var _this = this,
        component = this.refs[key];

    this.currentlyTransitioningKeys[key] = true;

    if (component.componentWillLeave) {
        component.componentWillLeave(function() {
            return _this.__handleLeaveDone(key);
        });
    } else {
        this.__handleLeaveDone(key);
    }
};

TransitionGroupPrototype.__handleLeaveDone = function(key) {
    var component = this.refs[key],
        currentChildMapping, newChildren;

    if (component.componentDidLeave) {
        component.componentDidLeave();
    }

    delete this.currentlyTransitioningKeys[key];
    currentChildMapping = getChildMapping(this.children);

    if (currentChildMapping && currentChildMapping[key]) {
        this.performEnter(key);
    } else {
        newChildren = extend({}, this.state.children);
        delete newChildren[key];

        this.setState({
            children: newChildren
        });
    }
};

TransitionGroupPrototype.render = function() {
    var childrenToRender = [],
        childFactory = this.props.childFactory,
        children = this.state.children,
        key, child;

    for (key in children) {
        if ((child = children[key])) {
            childrenToRender[childrenToRender.length] = childFactory(createTransitionChild(child, key, key));
        }
    }

    return virt.createView(this.props.tagName, this.props, childrenToRender);
};
