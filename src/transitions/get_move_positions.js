var has = require("has");


module.exports = getMovePositions;


function getMovePositions(currentKeyPositions, nextChildMapping, keysToMoveUp, keysToMoveDown) {
    var index = 0,
        key, prev;

    for (key in nextChildMapping) {
        if (has(nextChildMapping, key)) {
            prev = currentKeyPositions[key];

            if (prev != null) {
                if (prev > index) {
                    keysToMoveDown[keysToMoveDown.length] = key;
                } else if (prev < index) {
                    keysToMoveUp[keysToMoveUp.length] = key;
                }
            }

            currentKeyPositions[key] = index++;
        }
    }
}
