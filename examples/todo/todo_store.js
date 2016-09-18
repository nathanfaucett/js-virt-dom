var EventEmitter = require("@nathanfaucett/event_emitter"),
    values = require("@nathanfaucett/values"),
    dispatcher = require("./dispatcher");


var TodoStore = module.exports = new EventEmitter(-1),
    CHANGE = "CHANGE";


TodoStore.consts = {
    TODO_CREATE: "TODO_CREATE",
    TODO_UPDATE: "TODO_UPDATE",
    TODO_DESTROY: "TODO_DESTROY"
};


var _id = 0,
    _todos = {};



createTodo("This is a Todo item");


function createTodo(text) {
    var id = (_id++).toString(36);

    return (_todos[id] = {
        id: id,
        text: text
    });
}
function create(text, callback) {
    callback(undefined, createTodo(text));
}

function update(id, text, callback) {
    var todo = _todos[id];

    todo.text = text;

    callback(undefined, todo);
}

function destroy(id, callback) {
    var todo = _todos[id];

    delete _todos[id];

    callback(undefined, todo);
}

TodoStore.all = function(callback) {
    callback(undefined, values(_todos));
};

TodoStore.show = function(id, callback) {
    callback(undefined, _todos[id]);
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
        case TodoStore.consts.TODO_DESTROY:
            destroy(action.id, function() {
                TodoStore.emitChange();
            });
            break;
    }
});
