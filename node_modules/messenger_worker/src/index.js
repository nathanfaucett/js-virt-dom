var environment = require("environment");


var globalWorker;


if (environment.worker) {
    globalWorker = self;
}


module.exports = MessengerWorker;


function MessengerWorker(url) {
    var MESSAGE_ID = 0,
        worker = environment.worker ? globalWorker : new Worker(url),
        listeners = {},
        messages = {};

    worker.onmessage = function(e) {
        var message = JSON.parse(e.data),
            id = message.id,
            name = message.name,
            callback = messages[id];

        if (name) {
            if (listeners[name]) {
                emit(listeners[name], message.data, function callback(err, data) {
                    worker.postMessage(JSON.stringify({
                        id: id,
                        data: data
                    }));
                });
            }
        } else {
            if (callback) {
                callback(message.error, message.data);
                delete messages[id];
            }
        }
    };

    this.emit = function(name, data, callback) {
        var id = MESSAGE_ID++;

        messages[id] = callback;

        worker.postMessage(JSON.stringify({
            id: id,
            name: name,
            data: data
        }));
    };

    this.on = function(name, callback) {
        var listener = listeners[name] || (listeners[name] = []);
        listener[listener.length] = callback;
    };

    this.off = function(name, callback) {
        var listener = listeners[name],
            i;

        if (listener) {
            i = listener.length;

            while (i--) {
                if (listener[i] === callback) {
                    listener.splice(i, 1);
                }
            }
        }
    };
}

function emit(listeners, data, callback) {
    var index = 0,
        length = listeners.length,
        called = false;

    function done(err, data) {
        if (called === false) {
            called = true;
            callback(err, data);
        }
    }

    function next(err, data) {
        if (err || index === length) {
            done(err, data);
        } else {
            listeners[index++](data, next);
        }
    }

    next(undefined, data);
}
