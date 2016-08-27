var extend = require("@nathanfaucett/extend");


extend(
    exports,
    require("./nodeHandlers"),
    require("./buttonHandlers"),
    require("./imageHandlers"),
    require("./inputHandlers"),
    require("./textareaHandlers")
);