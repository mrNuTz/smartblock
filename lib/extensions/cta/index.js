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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var edit_icon_1 = require("../image/edit-icon");
var icon_1 = require("./icon");
var types_1 = require("../../types");
var prosemirror_model_1 = require("prosemirror-model");
var utils_1 = require("../../utils");
var button_1 = require("../../components/button");
var Cta = /** @class */ (function (_super) {
    __extends(Cta, _super);
    function Cta(props) {
        var _this = _super.call(this, props) || this;
        _this.name = 'cta';
        _this.group = 'block';
        _this.showMenu = true;
        _this.openDialog = function (state, dispatch) {
            var node = utils_1.findSelectedNodeWithType(state.schema.nodes.cta, state);
            var onOk = function (attrs) { return utils_1.setNodeMarkup(state.schema.nodes.cta, attrs)(state, dispatch); };
            var onCancel = function () { };
            _this._openDialog(onOk, onCancel, __assign({}, node === null || node === void 0 ? void 0 : node.attrs));
        };
        _this._openDialog = props.openDialog;
        _this._attributes = props.attributes;
        return _this;
    }
    Object.defineProperty(Cta.prototype, "schema", {
        get: function () {
            var _this = this;
            if (this.customSchema) {
                return this.customSchema;
            }
            return {
                content: 'text*',
                selectable: true,
                group: 'block',
                parseDOM: [
                    {
                        tag: 'div.cta',
                        getAttrs: function (dom) {
                            var a = dom.querySelector('a');
                            return !a ? {} : _this._attributes.reduce(function (attrs, attr) {
                                attrs[attr] = a.getAttribute(attr);
                                return attrs;
                            }, {});
                        },
                        getContent: function () { return prosemirror_model_1.Fragment.empty; }
                    }
                ],
                attrs: this._attributes.reduce(function (attrs, attr) {
                    attrs[attr] = { default: '' };
                    return attrs;
                }, {}),
                toDOM: function (node) {
                    return ['div', { class: 'cta' }, ['a', __assign(__assign({ role: 'button' }, node.attrs), { class: (node.attrs.class || '') + " variant-" + (node.attrs.variant || 'primary') }), node.attrs.text || '']];
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cta.prototype, "icon", {
        get: function () {
            return React.createElement(icon_1.default, null);
        },
        enumerable: false,
        configurable: true
    });
    Cta.prototype.active = function (state) {
        return utils_1.blockActive(state.schema.nodes.cta)(state);
    };
    Cta.prototype.enable = function (state) {
        var node = utils_1.getParentNodeFromState(state);
        if (node.type.name !== 'paragraph' || node.content.size > 0) {
            return false;
        }
        return utils_1.setNodeMarkup(state.schema.nodes.cta, {})(state);
    };
    Cta.prototype.customButton = function (_a) {
        var _this = this;
        var state = _a.state, dispatch = _a.dispatch;
        var disabled = (this.enable && !this.enable(state)) || this.hideMenuOnFocus;
        return (React.createElement(button_1.default, { active: this.active(state), disabled: disabled, onClick: function () {
                _this.openDialog(state, dispatch);
            } }, this.icon));
    };
    Cta.prototype.customMenu = function (_a) {
        var _this = this;
        var state = _a.state, dispatch = _a.dispatch;
        return (React.createElement(React.Fragment, null,
            React.createElement(button_1.default, { onClick: function () { return _this.openDialog(state, dispatch); } },
                React.createElement(edit_icon_1.default, { style: { width: '24px', height: '24px' } }))));
    };
    return Cta;
}(types_1.Extension));
exports.default = Cta;
//# sourceMappingURL=index.js.map