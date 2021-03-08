"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var prosemirror_commands_1 = require("prosemirror-commands");
var types_1 = require("../../types");
var utils_1 = require("../../utils");
var Sup = /** @class */ (function (_super) {
    __extends(Sup, _super);
    function Sup(props) {
        var _this = _super.call(this, props) || this;
        _this.name = 'sup';
        _this.group = 'mark';
        _this.showMenu = true;
        _this.showInlineMenuOnCaret = true;
        return _this;
    }
    Object.defineProperty(Sup.prototype, "schema", {
        get: function () {
            if (this.customSchema) {
                return this.customSchema;
            }
            return {
                group: 'mark',
                parseDOM: [{ tag: 'sup' }],
                toDOM: function () { return ['sup']; }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sup.prototype, "icon", {
        get: function () {
            return React.createElement("strong", { style: { fontFamily: 'sans-serif' } },
                "x",
                React.createElement("sup", null, "2"));
        },
        enumerable: false,
        configurable: true
    });
    Sup.prototype.active = function (state) {
        return utils_1.markActive(state.schema.marks.sup)(state);
    };
    Sup.prototype.onClick = function (state, dispatch) {
        prosemirror_commands_1.toggleMark(state.schema.marks.sup)(state, dispatch);
    };
    return Sup;
}(types_1.Extension));
exports.default = Sup;
//# sourceMappingURL=index.js.map