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
var Heading2 = /** @class */ (function (_super) {
    __extends(Heading2, _super);
    function Heading2(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(Heading2.prototype, "name", {
        get: function () {
            return 'heading2';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading2.prototype, "group", {
        get: function () {
            return 'block';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading2.prototype, "showMenu", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading2.prototype, "schema", {
        get: function () {
            var _this = this;
            if (this.customSchema) {
                return this.customSchema;
            }
            return {
                content: 'inline*',
                group: 'block',
                defining: true,
                parseDOM: [{ tag: 'h2' }],
                attrs: {},
                toDOM: function () { return ['h2', { class: _this.className }, 0]; }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading2.prototype, "icon", {
        get: function () {
            return React.createElement("strong", { style: { fontFamily: 'sans-serif' } },
                "H",
                React.createElement("sub", null, "M"));
        },
        enumerable: false,
        configurable: true
    });
    Heading2.prototype.active = function (state) {
        return utils_1.blockActive(state.schema.nodes.heading2)(state);
    };
    Heading2.prototype.enable = function (state) {
        return prosemirror_commands_1.setBlockType(state.schema.nodes.heading2)(state);
    };
    Heading2.prototype.onClick = function (state, dispatch) {
        prosemirror_commands_1.setBlockType(state.schema.nodes.heading2)(state, dispatch);
    };
    return Heading2;
}(types_1.Extension));
exports.default = Heading2;
//# sourceMappingURL=heading2.js.map