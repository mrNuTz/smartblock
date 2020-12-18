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
var heading6_1 = require("../components/icons/heading6");
var types_1 = require("../types");
var utils_1 = require("../utils");
var Heading6 = /** @class */ (function (_super) {
    __extends(Heading6, _super);
    function Heading6(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(Heading6.prototype, "name", {
        get: function () {
            return 'heading6';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading6.prototype, "group", {
        get: function () {
            return 'block';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading6.prototype, "showMenu", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading6.prototype, "schema", {
        get: function () {
            var _this = this;
            if (this.customSchema) {
                return this.customSchema;
            }
            return {
                content: 'inline*',
                group: 'block',
                defining: true,
                parseDOM: [{ tag: 'h6' }],
                attrs: {},
                toDOM: function () { return ['h6', { class: _this.className }, 0]; }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading6.prototype, "icon", {
        get: function () {
            return React.createElement(heading6_1.default, { style: { width: '24px', height: '24px' } });
        },
        enumerable: false,
        configurable: true
    });
    Heading6.prototype.active = function (state) {
        return utils_1.blockActive(state.schema.nodes.heading6)(state);
    };
    Heading6.prototype.enable = function (state) {
        return prosemirror_commands_1.setBlockType(state.schema.nodes.heading6)(state);
    };
    Heading6.prototype.onClick = function (state, dispatch) {
        prosemirror_commands_1.setBlockType(state.schema.nodes.heading6)(state, dispatch);
    };
    return Heading6;
}(types_1.Extension));
exports.default = Heading6;
//# sourceMappingURL=heading6.js.map