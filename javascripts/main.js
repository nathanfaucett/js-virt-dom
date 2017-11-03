(function() {
    var FONT_SIZE = 16;

    function lineCount(str) {
        return (str || "").split(/\r|\n/).length;
    }

    function createAceEditor(style, fontSize) {
        var divs = document.querySelectorAll(".ace-editor." + style),
            i, il, div, editor, lines;

        for (i = 0, il = divs.length; i < il; i++) {
            div = divs[i];
            editor = ace.edit(div);
            editor.setTheme("ace/theme/tomorrow");
            editor.setFontSize(fontSize);
            editor.setReadOnly(true);
            editor.getSession().setMode("ace/mode/" + style);
            lines = lineCount(editor.getValue());
            editor.container.style.height = (lines * (fontSize * 1.2)) + "px";
            editor.gotoLine(lines, 0, false);
        }
    }

    window.onload = function() {
        createAceEditor("bash", FONT_SIZE);
        createAceEditor("javascript", FONT_SIZE);
    };
}());
