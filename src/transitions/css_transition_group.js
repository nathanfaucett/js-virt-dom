var virt = require("virt"),
    TransitionGroup = require("./transition_group"),
    CSSTransitionGroupChild = require("./css_transition_group_child");


var CSSTransitionGroupPrototype;


module.exports = CSSTransitionGroup;


function CSSTransitionGroup(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    props.transitionName = props.transitionName || "transition";
    props.transitionEnter = props.transitionEnter || true;
    props.transitionLeave = props.transitionLeave || true;

    props.childFactory = function(child) {
        return _this.__wrapChild(child);
    };
}
virt.Component.extend(CSSTransitionGroup, "CSSTransitionGroup");

CSSTransitionGroupPrototype = CSSTransitionGroup.prototype;

CSSTransitionGroupPrototype.__wrapChild = function(child) {
    var props = this.props;

    return virt.createView(CSSTransitionGroupChild, {
        name: props.transitionName,
        enter: props.transitionEnter,
        leave: props.transitionLeave
    }, child);
};

CSSTransitionGroupPrototype.render = function() {
    return virt.createView(TransitionGroup, this.props, this.children);
};
