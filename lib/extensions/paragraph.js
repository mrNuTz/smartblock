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
var paragraph_1 = require("../components/icons/paragraph");
var types_1 = require("../types");
var utils_1 = require("../utils");
var Paragraph = /** @class */ (function (_super) {
    __extends(Paragraph, _super);
    function Paragraph(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(Paragraph.prototype, "name", {
        get: function () {
            return 'paragraph';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Paragraph.prototype, "group", {
        get: function () {
            return 'block';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Paragraph.prototype, "showMenu", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Paragraph.prototype, "schema", {
        get: function () {
            var _this = this;
            if (this.customSchema) {
                return this.customSchema;
            }
            return {
                content: 'inline*',
                group: 'block',
                parseDOM: [{ tag: 'p' }],
                attrs: {},
                toDOM: function () { return ['p', { class: _this.className }, 0]; }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Paragraph.prototype, "icon", {
        get: function () {
            return React.createElement(paragraph_1.default, { style: { width: '24px', height: '24px' } });
        },
        enumerable: false,
        configurable: true
    });
    Paragraph.prototype.active = function (state) {
        return utils_1.blockActive(state.schema.nodes.paragraph)(state);
    };
    Paragraph.prototype.enable = function (state) {
        return prosemirror_commands_1.setBlockType(state.schema.nodes.paragraph)(state);
    };
    Paragraph.prototype.onClick = function (state, dispatch) {
        prosemirror_commands_1.setBlockType(state.schema.nodes.paragraph)(state, dispatch);
    };
    return Paragraph;
}(types_1.Extension));
exports.default = Paragraph;
//# sourceMappingURL=paragraph.js.map