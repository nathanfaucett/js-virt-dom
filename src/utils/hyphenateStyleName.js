var reUppercasePattern = /([A-Z])/g,
    reMS = /^ms-/;


module.exports = hyphenateStyleName;


function hyphenateStyleName(str) {
    return hyphenate(str).replace(reMS, "-ms-");
}

function hyphenate(str) {
    return str.replace(reUppercasePattern, "-$1").toLowerCase();
}
