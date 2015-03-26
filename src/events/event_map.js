var SyntheticClipboardEvent = require("./synthetic_clipboard_event"),
    SyntheticDragEvent = require("./synthetic_drag_event"),
    SyntheticFocusEvent = require("./synthetic_focus_event"),
    SyntheticInputEvent = require("./synthetic_input_event"),
    SyntheticKeyboardEvent = require("./synthetic_keyboard_event"),
    SyntheticMouseEvent = require("./synthetic_mouse_event"),
    SyntheticTouchEvent = require("./synthetic_touch_event"),
    SyntheticUIEvent = require("./synthetic_ui_event"),
    SyntheticWheelEvent = require("./synthetic_wheel_event");


module.exports = {
    // Clipboard Events
    copy: SyntheticClipboardEvent,
    cut: SyntheticClipboardEvent,
    paste: SyntheticClipboardEvent,

    // Keyboard Events
    keydown: SyntheticKeyboardEvent,
    keyup: SyntheticKeyboardEvent,
    keypress: SyntheticKeyboardEvent,

    // Focus Events
    focus: SyntheticFocusEvent,
    blur: SyntheticFocusEvent,

    // Form Events
    change: SyntheticInputEvent,
    input: SyntheticInputEvent,
    submit: SyntheticInputEvent,

    // Mouse Events
    click: SyntheticMouseEvent,
    doubleclick: SyntheticMouseEvent,
    mousedown: SyntheticMouseEvent,
    mouseenter: SyntheticMouseEvent,
    mouseleave: SyntheticMouseEvent,
    mousemove: SyntheticMouseEvent,
    mouseout: SyntheticMouseEvent,
    mouseover: SyntheticMouseEvent,
    mouseup: SyntheticMouseEvent,

    // Drag Events
    drag: SyntheticDragEvent,
    dragend: SyntheticDragEvent,
    dragenter: SyntheticDragEvent,
    dragexit: SyntheticDragEvent,
    dragleave: SyntheticDragEvent,
    dragover: SyntheticDragEvent,
    dragstart: SyntheticDragEvent,
    dragdrop: SyntheticDragEvent,

    // Touch Events
    touchcancel: SyntheticTouchEvent,
    touchend: SyntheticTouchEvent,
    touchmove: SyntheticTouchEvent,
    touchstart: SyntheticTouchEvent,

    // Scroll Event
    scroll: SyntheticUIEvent,

    // Wheel Event
    wheel: SyntheticWheelEvent
};
