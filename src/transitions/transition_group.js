var virt = require("virt"),
    has = require("has"),
    extend = require("extend"),
    forEach = require("for_each"),
    createTransitionChild = require("./create_transition_child"),
    getChildMapping = require("./get_child_mapping"),
    getMovePositions = require("./get_move_positions"),
    mergeChildMappings = require("./merge_child_mappings");


var TransitionGroupPrototype;


module.exports = TransitionGroup;


function TransitionGroup(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.currentlyTransitioningKeys = {};
    this.currentKeyPositions = {};
    this.keysToEnter = [];
    this.keysToLeave = [];
    this.keysToMoveUp = [];
    this.keysToMoveDown = [];

    this.state = {
        children: getChildMapping(children)
    };

    this.performEnter = function(key) {
        return _this.__performEnter(key);
    };
    this.performLeave = function(key) {
        return _this.__performLeave(key);
    };
    this.performMoveUp = function(key) {
        return _this.__performMoveUp(key);
    };
    this.performMoveDown = function(key) {
        return _this.__performMoveDown(key);
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
        key, childMappings;


    childMappings = mergeChildMappings(prevChildMapping, nextChildMapping);
    getMovePositions(this.currentKeyPositions, nextChildMapping, this.keysToMoveUp, this.keysToMoveDown);

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
        children: childMappings
    });
};

TransitionGroupPrototype.componentDidUpdate = function() {
    var keysToEnter = this.keysToEnter,
        keysToLeave = this.keysToLeave,
        keysToMoveUp = this.keysToMoveUp,
        keysToMoveDown = this.keysToMoveDown;

    this.keysToEnter = [];
    forEach(keysToEnter, this.performEnter);

    this.keysToLeave = [];
    forEach(keysToLeave, this.performLeave);

    this.keysToMoveUp = [];
    forEach(keysToMoveUp, this.performMoveUp);

    this.keysToMoveDown = [];
    forEach(keysToMoveDown, this.performMoveDown);
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

    delete this.currentKeyPositions[key];
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

TransitionGroupPrototype.__performMoveUp = function(key) {
    var _this = this,
        component = this.refs[key];

    this.currentlyTransitioningKeys[key] = true;

    if (component.componentWillMoveUp) {
        component.componentWillMoveUp(function() {
            return _this.__handleMoveUpDone(key);
        });
    } else {
        this.__handleMoveUpDone(key);
    }
};

TransitionGroupPrototype.__performMoveDown = function(key) {
    var _this = this,
        component = this.refs[key];

    this.currentlyTransitioningKeys[key] = true;

    if (component.componentWillMoveDown) {
        component.componentWillMoveDown(function() {
            return _this.__handleMoveDownDone(key);
        });
    } else {
        this.__handleMoveDownDone(key);
    }
};

TransitionGroupPrototype.__handleMoveUpDone = function(key) {
    var component = this.refs[key],
        currentChildMapping;

    if (component.componentDidMoveUp) {
        component.componentDidMoveUp();
    }

    delete this.currentlyTransitioningKeys[key];
    currentChildMapping = getChildMapping(this.children);

    if (!currentChildMapping || !currentChildMapping[key]) {
        this.__performLeave(key);
    }
};

TransitionGroupPrototype.__handleMoveDownDone = function(key) {
    var component = this.refs[key],
        currentChildMapping;

    if (component.componentDidMoveDown) {
        component.componentDidMoveDown();
    }

    delete this.currentlyTransitioningKeys[key];
    currentChildMapping = getChildMapping(this.children);

    if (!currentChildMapping || !currentChildMapping[key]) {
        this.__performLeave(key);
    }
};

TransitionGroupPrototype.render = function() {
    var childrenToRender = [],
        childFactory = this.props.childFactory,
        children = this.state.children,
        key, child;

    if (children) {
        for (key in children) {
            if ((child = children[key])) {
                childrenToRender[childrenToRender.length] = createTransitionChild(childFactory(child), key, key);
            }
        }
    }

    return virt.createView(this.props.tagName, this.props, childrenToRender);
};
