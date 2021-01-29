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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var float_image_1 = require("../../components/icons/float-image");
var edit_icon_1 = require("../image/edit-icon");
var utils_1 = require("../../utils");
var types_1 = require("../../types");
var plugins_1 = require("../image/plugins");
var button_1 = require("../../components/button");
var prosemirror_schema_list_1 = require("prosemirror-schema-list");
var ImageWithText = /** @class */ (function (_super) {
    __extends(ImageWithText, _super);
    function ImageWithText(_a) {
        var openDialog = _a.openDialog, attributes = _a.attributes, previewSrcFromAttrs = _a.previewSrcFromAttrs, aspectRatio = _a.aspectRatio, props = __rest(_a, ["openDialog", "attributes", "previewSrcFromAttrs", "aspectRatio"]);
        var _this = _super.call(this, props) || this;
        _this.name = 'image_with_text';
        _this.showMenu = true;
        _this.group = 'block';
        _this.hideBlockMenuOnFocus = true;
        _this.openDialog = function (state, dispatch) {
            var node = utils_1.findSelectedNodeWithType(state.schema.nodes.image_with_text, state);
            var onOk = function (attrs) { return node
                ? utils_1.setNodeMarkup(state.schema.nodes.image_with_text, attrs)(state, dispatch)
                : prosemirror_schema_list_1.wrapInList(state.schema.nodes.image_with_text, attrs)(state, dispatch); };
            var onCancel = function () { };
            _this._openDialog(onOk, onCancel, __assign({}, node === null || node === void 0 ? void 0 : node.attrs));
        };
        _this._openDialog = openDialog;
        _this._attributes = attributes.includes('src') ? attributes : attributes.concat('src');
        _this._previewSrcFromAttrs = previewSrcFromAttrs || (function (_a) {
            var src = _a.src;
            return src;
        });
        _this._aspectRatio = aspectRatio;
        return _this;
    }
    Object.defineProperty(ImageWithText.prototype, "schema", {
        get: function () {
            var _this = this;
            return {
                content: 'paragraph block*',
                group: 'block',
                attrs: this._attributes.reduce(function (attrs, attr) {
                    attrs[attr] = { default: '' };
                    return attrs;
                }, {}),
                parseDOM: [{
                        tag: 'section',
                        getAttrs: function (dom) {
                            var img = dom.querySelector('img');
                            return img ? _this._attributes.concat('_src').reduce(function (attrs, attr) {
                                if (attr === 'src')
                                    return attrs;
                                var a = img.getAttribute(attr);
                                if (a)
                                    attrs[attr === '_src' ? 'src' : attr] = a;
                                return attrs;
                            }, {}) : {};
                        }
                    }],
                toDOM: function (node) {
                    var src = _this._previewSrcFromAttrs(node.attrs);
                    var _a = node.attrs, _src = _a.src, attrs = __rest(_a, ["src"]);
                    return ['section', {}, ['figure',
                            { class: 'img-float-left' }, (_this._aspectRatio > 0) ? ['div', { class: 'img-container', style: "padding-bottom: " + 100 / _this._aspectRatio + "%;" },
                                ['img', __assign(__assign({}, attrs), { src: src, _src: _src })]
                            ] : ['img', __assign(__assign({}, attrs), { src: src, _src: _src })]
                        ], ['main', {}, 0],];
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    ImageWithText.prototype.customButton = function (_a) {
        var _this = this;
        var state = _a.state, dispatch = _a.dispatch;
        var disabled = (this.enable && !this.enable(state)) || this.hideMenuOnFocus;
        return (React.createElement(button_1.default, { active: this.active(state), disabled: disabled, onClick: function () {
                _this.openDialog(state, dispatch);
            } }, this.icon));
    };
    ImageWithText.prototype.customMenu = function (_a) {
        var _this = this;
        var state = _a.state, dispatch = _a.dispatch;
        return (React.createElement(React.Fragment, null,
            React.createElement(button_1.default, { onClick: function () { return _this.openDialog(state, dispatch); } },
                React.createElement(edit_icon_1.default, { style: { width: '24px', height: '24px' } }))));
    };
    ImageWithText.prototype.active = function (state) {
        return utils_1.blockActive(state.schema.nodes.image_with_text)(state);
    };
    ImageWithText.prototype.enable = function (state) {
        return prosemirror_schema_list_1.wrapInList(state.schema.nodes.image_with_text)(state);
    };
    Object.defineProperty(ImageWithText.prototype, "icon", {
        get: function () {
            return React.createElement(float_image_1.default, { style: { width: '24px', height: '24px' } });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageWithText.prototype, "plugins", {
        get: function () {
            return [plugins_1.MediaPlugin()];
        },
        enumerable: false,
        configurable: true
    });
    return ImageWithText;
}(types_1.Extension));
exports.default = ImageWithText;
//# sourceMappingURL=index.js.map