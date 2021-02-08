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
var utils_1 = require("../../utils");
var button_1 = require("../../components/button");
var Product = /** @class */ (function (_super) {
    __extends(Product, _super);
    function Product(props) {
        var _this = _super.call(this, props) || this;
        _this.name = 'product';
        _this.group = 'block';
        _this.showMenu = true;
        _this.openDialog = function (state, dispatch) {
            var node = utils_1.findSelectedNodeWithType(state.schema.nodes.product, state);
            var onOk = function (attrs) { return utils_1.setNodeMarkup(state.schema.nodes.product, attrs)(state, dispatch); };
            var onCancel = function () { };
            _this._openDialog(onOk, onCancel, __assign({}, node === null || node === void 0 ? void 0 : node.attrs));
        };
        _this._openDialog = props.openDialog;
        _this._attributes = props.attributes;
        return _this;
    }
    Object.defineProperty(Product.prototype, "schema", {
        get: function () {
            var _this = this;
            if (this.customSchema) {
                return this.customSchema;
            }
            return {
                content: 'text*',
                group: 'block',
                selectable: true,
                parseDOM: [
                    {
                        tag: 'div.product',
                        getAttrs: function (dom) { return _this._attributes.reduce(function (attrs, attr) {
                            attrs[attr] = dom.getAttribute(attr);
                            return attrs;
                        }, {}); }
                    }
                ],
                attrs: this._attributes.reduce(function (attrs, attr) {
                    attrs[attr] = { default: '' };
                    return attrs;
                }, {}),
                toDOM: function (node) { return ['div', __assign({ class: 'product' }, node.attrs), ['div', { class: 'foto' }],
                    ['div', { class: 'text' },
                        ['div', { class: 'title' }, node.attrs.title || 'Product'],
                        ['div', { class: 'price' }, '€ X,XX']]]; }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "icon", {
        get: function () {
            return React.createElement(icon_1.default, null);
        },
        enumerable: false,
        configurable: true
    });
    Product.prototype.active = function (state) {
        return utils_1.blockActive(state.schema.nodes.product)(state);
    };
    Product.prototype.enable = function (state) {
        var node = utils_1.getParentNodeFromState(state);
        if (node.type.name !== 'paragraph' || node.content.size > 0) {
            return false;
        }
        return utils_1.setNodeMarkup(state.schema.nodes.product, {})(state);
    };
    Product.prototype.customButton = function (_a) {
        var _this = this;
        var state = _a.state, dispatch = _a.dispatch;
        var disabled = (this.enable && !this.enable(state)) || this.hideMenuOnFocus;
        return (React.createElement(button_1.default, { active: this.active(state), disabled: disabled, onClick: function () {
                _this.openDialog(state, dispatch);
            } }, this.icon));
    };
    Product.prototype.customMenu = function (_a) {
        var _this = this;
        var state = _a.state, dispatch = _a.dispatch;
        return (React.createElement(React.Fragment, null,
            React.createElement(button_1.default, { onClick: function () { return _this.openDialog(state, dispatch); } },
                React.createElement(edit_icon_1.default, { style: { width: '24px', height: '24px' } }))));
    };
    return Product;
}(types_1.Extension));
exports.default = Product;
//# sourceMappingURL=index.js.map