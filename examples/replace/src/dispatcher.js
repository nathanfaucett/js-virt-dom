var EventEmitter = require("event_emitter");


var dispatcher = module.exports = new EventEmitter(-1);


dispatcher.register = function(callback) {
    dispatcher.on("dispatch", callback);
    return callback;
};

dispatcher.handleViewAction = function(action) {
    dispatcher.emit("dispatch", {
        type: "VIEW_ACTION",
        action: action
    });
};
