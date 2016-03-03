var SyntheticAnimationEvent = require("./syntheticEvents/SyntheticAnimationEvent"),
    SyntheticTransitionEvent = require("./syntheticEvents/SyntheticTransitionEvent"),
    SyntheticClipboardEvent = require("./syntheticEvents/SyntheticClipboardEvent"),
    SyntheticCompositionEvent = require("./syntheticEvents/SyntheticCompositionEvent"),
    SyntheticDragEvent = require("./syntheticEvents/SyntheticDragEvent"),
    SyntheticEvent = require("./syntheticEvents/SyntheticEvent"),
    SyntheticFocusEvent = require("./syntheticEvents/SyntheticFocusEvent"),
    SyntheticInputEvent = require("./syntheticEvents/SyntheticInputEvent"),
    SyntheticKeyboardEvent = require("./syntheticEvents/SyntheticKeyboardEvent"),
    SyntheticMouseEvent = require("./syntheticEvents/SyntheticMouseEvent"),
    SyntheticTouchEvent = require("./syntheticEvents/SyntheticTouchEvent"),
    SyntheticUIEvent = require("./syntheticEvents/SyntheticUIEvent"),
    SyntheticWheelEvent = require("./syntheticEvents/SyntheticWheelEvent");


module.exports = {
    topAbort: SyntheticEvent,

    topAnimationEnd: SyntheticAnimationEvent,
    topAnimationIteration: SyntheticAnimationEvent,
    topAnimationStart: SyntheticAnimationEvent,

    topBlur: SyntheticFocusEvent,

    topCanPlay: SyntheticEvent,
    topCanPlayThrough: SyntheticEvent,

    topChange: SyntheticInputEvent,
    topClick: SyntheticMouseEvent,

    topCompositionEnd: SyntheticCompositionEvent,
    topCompositionStart: SyntheticCompositionEvent,
    topCompositionUpdate: SyntheticCompositionEvent,

    topContextMenu: SyntheticMouseEvent,

    topCopy: SyntheticClipboardEvent,
    topCut: SyntheticClipboardEvent,

    topDoubleClick: SyntheticMouseEvent,

    topDrag: SyntheticDragEvent,
    topDragEnd: SyntheticDragEvent,
    topDragEnter: SyntheticDragEvent,
    topDragExit: SyntheticDragEvent,
    topDragLeave: SyntheticDragEvent,
    topDragOver: SyntheticDragEvent,
    topDragStart: SyntheticDragEvent,
    topDrop: SyntheticDragEvent,

    topDurationChange: SyntheticEvent,
    topEmptied: SyntheticEvent,
    topEncrypted: SyntheticEvent,
    topError: SyntheticEvent,
    topFocus: SyntheticFocusEvent,
    topInput: SyntheticInputEvent,
    topInvalid: SyntheticEvent,

    topKeyDown: SyntheticKeyboardEvent,
    topKeyPress: SyntheticKeyboardEvent,

    topKeyUp: SyntheticKeyboardEvent,

    topLoad: SyntheticUIEvent,
    topLoadStart: SyntheticEvent,
    topLoadedData: SyntheticEvent,
    topLoadedMetadata: SyntheticEvent,

    topMouseDown: SyntheticMouseEvent,
    topMouseEnter: SyntheticMouseEvent,
    topMouseMove: SyntheticMouseEvent,
    topMouseOut: SyntheticMouseEvent,
    topMouseOver: SyntheticMouseEvent,
    topMouseUp: SyntheticMouseEvent,

    topOrientationChange: SyntheticEvent,

    topPaste: SyntheticClipboardEvent,

    topPause: SyntheticEvent,
    topPlay: SyntheticEvent,
    topPlaying: SyntheticEvent,
    topProgress: SyntheticEvent,

    topRateChange: SyntheticEvent,
    topReset: SyntheticEvent,
    topResize: SyntheticUIEvent,

    topScroll: SyntheticUIEvent,

    topSeeked: SyntheticEvent,
    topSeeking: SyntheticEvent,

    topSelectionChange: SyntheticEvent,

    topStalled: SyntheticEvent,

    topSubmit: SyntheticEvent,
    topSuspend: SyntheticEvent,

    topTextInput: SyntheticInputEvent,

    topTimeUpdate: SyntheticEvent,

    topTouchCancel: SyntheticTouchEvent,
    topTouchEnd: SyntheticTouchEvent,
    topTouchMove: SyntheticTouchEvent,
    topTouchStart: SyntheticTouchEvent,
    topTouchTap: SyntheticUIEvent,

    topTransitionEnd: SyntheticTransitionEvent,

    topVolumeChange: SyntheticEvent,
    topWaiting: SyntheticEvent,

    topWheel: SyntheticWheelEvent
};
