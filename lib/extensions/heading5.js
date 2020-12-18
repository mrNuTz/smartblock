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
var heading5_1 = require("../components/icons/heading5");
var types_1 = require("../types");
var utils_1 = require("../utils");
var Heading5 = /** @class */ (function (_super) {
    __extends(Heading5, _super);
    function Heading5(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(Heading5.prototype, "name", {
        get: function () {
            return 'heading5';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading5.prototype, "group", {
        get: function () {
            return 'block';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading5.prototype, "showMenu", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading5.prototype, "schema", {
        get: function () {
            var _this = this;
            if (this.customSchema) {
                return this.customSchema;
            }
            return {
                content: 'inline*',
                group: 'block',
                defining: true,
                parseDOM: [{ tag: 'h5' }],
                attrs: {},
                toDOM: function () { return ['h5', { class: _this.className }, 0]; }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading5.prototype, "icon", {
        get: function () {
            return React.createElement(heading5_1.default, { style: { width: '24px', height: '24px' } });
        },
        enumerable: false,
        configurable: true
    });
    Heading5.prototype.active = function (state) {
        return utils_1.blockActive(state.schema.nodes.heading5)(state);
    };
    Heading5.prototype.enable = function (state) {
        return prosemirror_commands_1.setBlockType(state.schema.nodes.heading5)(state);
    };
    Heading5.prototype.onClick = function (state, dispatch) {
        prosemirror_commands_1.setBlockType(state.schema.nodes.heading5)(state, dispatch);
    };
    return Heading5;
}(types_1.Extension));
exports.default = Heading5;
//# sourceMappingURL=heading5.js.map