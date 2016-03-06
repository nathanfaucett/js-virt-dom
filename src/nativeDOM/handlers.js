var extend = require("extend");


extend(
    exports,
    require("./nodeHandlers"),
    require("./buttonHandlers"),
    require("./imageHandlers"),
    require("./inputHandlers"),
    require("./textareaHandlers")
);
