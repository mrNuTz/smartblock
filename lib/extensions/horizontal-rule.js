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
var types_1 = require("../types");
var utils_1 = require("../utils");
var prosemirror_model_1 = require("prosemirror-model");
var HorizontalRule = /** @class */ (function (_super) {
    __extends(HorizontalRule, _super);
    function HorizontalRule(props) {
        var _this = _super.call(this, props) || this;
        _this.name = 'horizontal_rule';
        _this.group = 'block';
        _this.showMenu = true;
        return _this;
    }
    Object.defineProperty(HorizontalRule.prototype, "schema", {
        get: function () {
            if (this.customSchema) {
                return this.customSchema;
            }
            return {
                content: 'text*',
                group: 'block',
                selectable: true,
                parseDOM: [{
                        tag: 'hr',
                        getAttrs: function () { return ({}); },
                        getContent: function () { return prosemirror_model_1.Fragment.empty; },
                    }],
                toDOM: function () { return ['hr', 'foo']; }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HorizontalRule.prototype, "icon", {
        get: function () {
            return React.createElement("strong", { title: "horizontal-rule", style: { fontFamily: 'sans-serif' } }, "---");
        },
        enumerable: false,
        configurable: true
    });
    HorizontalRule.prototype.active = function (state) {
        return utils_1.blockActive(state.schema.nodes.horizontal_rule)(state);
    };
    HorizontalRule.prototype.enable = function (state) {
        var node = utils_1.getParentNodeFromState(state);
        if (node.type.name !== 'paragraph' || node.content.size > 0) {
            return false;
        }
        return utils_1.setNodeMarkup(state.schema.nodes.horizontal_rule, {})(state);
    };
    HorizontalRule.prototype.onClick = function (state, dispatch) {
        utils_1.setNodeMarkup(state.schema.nodes.horizontal_rule, {})(state, dispatch);
    };
    return HorizontalRule;
}(types_1.Extension));
exports.default = HorizontalRule;
//# sourceMappingURL=horizontal-rule.js.map