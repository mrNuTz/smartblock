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
var types_1 = require("../types");
var utils_1 = require("../utils");
var Heading4 = /** @class */ (function (_super) {
    __extends(Heading4, _super);
    function Heading4(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(Heading4.prototype, "name", {
        get: function () {
            return 'heading4';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading4.prototype, "group", {
        get: function () {
            return 'block';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading4.prototype, "showMenu", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading4.prototype, "schema", {
        get: function () {
            var _this = this;
            if (this.customSchema) {
                return this.customSchema;
            }
            return {
                content: 'inline*',
                group: 'block',
                defining: true,
                parseDOM: [{ tag: 'h4' }],
                attrs: {},
                toDOM: function () { return ['h4', { class: _this.className }, 0]; }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading4.prototype, "icon", {
        get: function () {
            return React.createElement("strong", { style: { fontFamily: 'sans-serif' } },
                "H",
                React.createElement("sub", { style: { fontSize: '.7rem' } }, "XS"));
        },
        enumerable: false,
        configurable: true
    });
    Heading4.prototype.active = function (state) {
        return utils_1.blockActive(state.schema.nodes.heading4)(state);
    };
    Heading4.prototype.enable = function (state) {
        return prosemirror_commands_1.setBlockType(state.schema.nodes.heading4)(state);
    };
    Heading4.prototype.onClick = function (state, dispatch) {
        prosemirror_commands_1.setBlockType(state.schema.nodes.heading4)(state, dispatch);
    };
    return Heading4;
}(types_1.Extension));
exports.default = Heading4;
//# sourceMappingURL=heading4.js.map