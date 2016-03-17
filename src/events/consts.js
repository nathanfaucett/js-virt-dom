var map = require("map"),
    forEach = require("for_each"),
    keyMirror = require("key_mirror"),
    removeTop = require("./removeTop"),
    replaceTopWithOn = require("./replaceTopWithOn");


var consts = exports,

    topLevelToEvent = consts.topLevelToEvent = {},
    propNameToTopLevel = consts.propNameToTopLevel = {},

    eventTypes = [
        "topAbort",
        "topAnimationEnd",
        "topAnimationIteration",
        "topAnimationStart",
        "topBlur",
        "topCanPlay",
        "topCanPlayThrough",
        "topChange",
        "topClick",
        "topCompositionEnd",
        "topCompositionStart",
        "topCompositionUpdate",
        "topContextMenu",
        "topCopy",
        "topCut",
        "topDblClick",
        "topDrag",
        "topDragEnd",
        "topDragEnter",
        "topDragExit",
        "topDragLeave",
        "topDragOver",
        "topDragStart",
        "topDrop",
        "topDurationChange",
        "topEmptied",
        "topEncrypted",
        "topEnded",
        "topError",
        "topFocus",
        "topInput",
        "topKeyDown",
        "topKeyPress",
        "topKeyUp",
        "topLoad",
        "topLoadStart",
        "topLoadedData",
        "topLoadedMetadata",
        "topMouseDown",
        "topMouseEnter",
        "topMouseMove",
        "topMouseOut",
        "topMouseOver",
        "topMouseUp",
        "topOrientationChange",
        "topPaste",
        "topPause",
        "topPlay",
        "topPlaying",
        "topProgress",
        "topRateChange",
        "topRateChange",
        "topReset",
        "topResize",
        "topScroll",
        "topSeeked",
        "topSeeking",
        "topSelectionChange",
        "topStalled",
        "topSubmit",
        "topSuspend",
        "topTextInput",
        "topTimeUpdate",
        "topTouchCancel",
        "topTouchEnd",
        "topTouchMove",
        "topTouchStart",
        "topTouchTap",
        "topTransitionEnd",
        "topVolumeChange",
        "topWaiting",
        "topWheel"
    ];

consts.phases = keyMirror([
    "bubbled",
    "captured"
]);

consts.topLevelTypes = keyMirror(eventTypes);

consts.propNames = map(eventTypes, replaceTopWithOn);

forEach(eventTypes, function(string) {
    propNameToTopLevel[replaceTopWithOn(string)] = string;
});

forEach(eventTypes, function(string) {
    topLevelToEvent[string] = removeTop(string).toLowerCase();
});
