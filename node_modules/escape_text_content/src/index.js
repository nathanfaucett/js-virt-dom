var ESCAPE_REGEX = /[&><"']/g,
    ESCAPE_LOOKUP = {
        "&": "&amp;",
        ">": "&gt;",
        "<": "&lt;",
        "\"": "&quot;",
        "'": "&#x27;"
    };


function escaper(match) {
    return ESCAPE_LOOKUP[match];
}

module.exports = function escapeTextContent(text) {
    return (text + "").replace(ESCAPE_REGEX, escaper);
};
