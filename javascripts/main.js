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
            editor.container.style.height = (lineCount(editor.getValue()) * (fontSize * 1.2)) + "px";
        }
    }

    window.onload = function() {
        createAceEditor("bash", FONT_SIZE);
        createAceEditor("javascript", FONT_SIZE);
    };
}());
