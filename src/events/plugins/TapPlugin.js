var now = require("@nathanfaucett/now"),
    indexOf = require("@nathanfaucett/index_of"),
    SyntheticUIEvent = require("../syntheticEvents/SyntheticUIEvent"),
    consts = require("../consts");


var topLevelTypes = consts.topLevelTypes,

    xaxis = {
        page: "pageX",
        client: "clientX",
        envScroll: "currentPageScrollLeft"
    },
    yaxis = {
        page: "pageY",
        client: "clientY",
        envScroll: "currentPageScrollTop"
    },

    touchEvents = [
        topLevelTypes.topTouchStart,
        topLevelTypes.topTouchCancel,
        topLevelTypes.topTouchEnd,
        topLevelTypes.topTouchMove
    ],

    TapPluginPrototype;


module.exports = TapPlugin;


function TapPlugin(eventHandler) {

    this.eventHandler = eventHandler;

    this.usedTouch = false;
    this.usedTouchTime = 0;

    this.tapMoveThreshold = 10;
    this.TOUCH_DELAY = 1000;

    this.startCoords = {
        x: null,
        y: null
    };
}
TapPluginPrototype = TapPlugin.prototype;

TapPluginPrototype.events = [
    topLevelTypes.topTouchTap
];

TapPluginPrototype.dependencies = [
    topLevelTypes.topMouseDown,
    topLevelTypes.topMouseMove,
    topLevelTypes.topMouseUp
].concat(touchEvents);

TapPluginPrototype.handle = function(topLevelType, nativeEvent /* , targetId */ ) {
    var startCoords, eventHandler, viewport, event;

    if (isStartish(topLevelType) || isEndish(topLevelType)) {
        if (indexOf(touchEvents, topLevelType) !== -1) {
            this.usedTouch = true;
            this.usedTouchTime = now();
        } else if (!this.usedTouch || ((now() - this.usedTouchTime) >= this.TOUCH_DELAY)) {
            startCoords = this.startCoords;
            eventHandler = this.eventHandler;
            viewport = eventHandler.viewport;

            if (
                isEndish(topLevelType) &&
                getDistance(startCoords, nativeEvent, viewport) < this.tapMoveThreshold
            ) {
                event = SyntheticUIEvent.getPooled(nativeEvent, eventHandler);
            }

            if (isStartish(topLevelType)) {
                startCoords.x = getAxisCoordOfEvent(xaxis, nativeEvent, viewport);
                startCoords.y = getAxisCoordOfEvent(yaxis, nativeEvent, viewport);
            } else if (isEndish(topLevelType)) {
                startCoords.x = 0;
                startCoords.y = 0;
            }

            if (event) {
                eventHandler.dispatchEvent(topLevelTypes.topTouchTap, event);
            }
        }
    }
};

function getAxisCoordOfEvent(axis, nativeEvent, viewport) {
    var singleTouch = extractSingleTouch(nativeEvent);

    if (singleTouch) {
        return singleTouch[axis.page];
    } else {
        return (
            axis.page in nativeEvent ?
            nativeEvent[axis.page] :
            nativeEvent[axis.client] + viewport[axis.envScroll]
        );
    }
}

function getDistance(coords, nativeEvent, viewport) {
    var pageX = getAxisCoordOfEvent(xaxis, nativeEvent, viewport),
        pageY = getAxisCoordOfEvent(yaxis, nativeEvent, viewport);

    return Math.pow(
        Math.pow(pageX - coords.x, 2) + Math.pow(pageY - coords.y, 2),
        0.5
    );
}

function extractSingleTouch(nativeEvent) {
    var touches = nativeEvent.touches,
        changedTouches = nativeEvent.changedTouches,
        hasTouches = touches && touches.length > 0,
        hasChangedTouches = changedTouches && changedTouches.length > 0;

    return (!hasTouches && hasChangedTouches ? changedTouches[0] :
        hasTouches ? touches[0] :
        nativeEvent
    );
}

function isStartish(topLevelType) {
    return (
        topLevelType === topLevelTypes.topMouseDown ||
        topLevelType === topLevelTypes.topTouchStart
    );
}

function isEndish(topLevelType) {
    return (
        topLevelType === topLevelTypes.topMouseUp ||
        topLevelType === topLevelTypes.topTouchEnd ||
        topLevelType === topLevelTypes.topTouchCancel
    );
}
