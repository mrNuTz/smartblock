"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInlineMenuVisible = void 0;
exports.isInlineMenuVisible = function (state, inlineMenu) {
    var selection = state.selection;
    if (!selection || !inlineMenu.length)
        return false;
    else if (!selection.empty)
        return true;
    else
        return inlineMenu.some(function (ex) { return ex.active && ex.active(state) && ex.showInlineMenuOnCaret; });
};
//# sourceMappingURL=index.js.map