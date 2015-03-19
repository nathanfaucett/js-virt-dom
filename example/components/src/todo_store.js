var EventEmitter = require("event_emitter"),
    values = require("values"),
    dispatcher = require("./dispatcher");


var TodoStore = module.exports = new EventEmitter(-1),
    CHANGE = "CHANGE";


TodoStore.consts = {
    TODO_CREATE: "TODO_CREATE",
    TODO_UPDATE: "TODO_UPDATE",
    TODO_DELETE: "TODO_DELETE"
};


var _todoId = 1,
    _todos = {};


function create(text, callback) {
    setTimeout(function() {
        var id = _todoId++,
            todo = _todos[id] = {
                id: id,
                text: text
            };

        callback(undefined, todo);
    }, Math.random() * 100);
}

function update(id, text, callback) {
    setTimeout(function() {
        var todo = _todos[id];

        todo.text = text;

        callback(undefined, todo);
    }, Math.random() * 100);
}

function destroy(id, callback) {
    setTimeout(function() {
        var todo = _todos[id];

        delete _todos[id];

        callback(undefined, todo);
    }, Math.random() * 100);
}

TodoStore.all = function(callback) {
    setTimeout(function() {
        callback(undefined, values(_todos));
    }, Math.random() * 100);
};

TodoStore.show = function(id, callback) {
    setTimeout(function() {
        callback(undefined, _todos[id]);
    }, Math.random() * 100);
};

TodoStore.addChangeListener = function(callback) {
    TodoStore.on(CHANGE, callback);
};

TodoStore.removeChangeListener = function(callback) {
    TodoStore.off(CHANGE, callback);
};

TodoStore.emitChange = function() {
    TodoStore.emit(CHANGE);
};

TodoStore.id = dispatcher.register(function(payload) {
    var action = payload.action;

    switch (action.actionType) {
        case TodoStore.consts.TODO_CREATE:
            create(action.text, function() {
                TodoStore.emitChange();
            });
            break;
        case TodoStore.consts.TODO_UPDATE:
            update(action.id, action.text, function() {
                TodoStore.emitChange();
            });
            break;
        case TodoStore.consts.TODO_DELETE:
            destroy(action.id, function() {
                TodoStore.emitChange();
            });
            break;
    }
});
