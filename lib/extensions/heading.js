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
var prosemirror_commands_1 = require("prosemirror-commands");
var types_1 = require("../types");
var utils_1 = require("../utils");
var button_1 = require("../components/button");
var Heading = /** @class */ (function (_super) {
    __extends(Heading, _super);
    function Heading(_a) {
        var sizes = _a.sizes, props = __rest(_a, ["sizes"]);
        var _this = _super.call(this, props) || this;
        _this.name = 'heading';
        _this.group = 'block';
        _this.showMenu = true;
        _this._sizes = sizes;
        return _this;
    }
    Object.defineProperty(Heading.prototype, "schema", {
        get: function () {
            if (this.customSchema) {
                return this.customSchema;
            }
            return {
                content: 'inline*',
                group: 'block',
                defining: true,
                parseDOM: [
                    {
                        tag: 'h1',
                        getAttrs: function (dom) { return ({
                            hsize: dom.getAttribute('hsize'),
                            usehtag: dom.getAttributes('usehtag')
                        }); }
                    }
                ],
                attrs: {
                    hsize: { default: this._sizes[0] },
                    usehtag: { default: 'true' }
                },
                toDOM: function (node) { return ['h1', node.attrs, 0]; }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Heading.prototype, "icon", {
        get: function () {
            return React.createElement("strong", { style: { fontFamily: 'sans-serif' } }, "H");
        },
        enumerable: false,
        configurable: true
    });
    Heading.prototype.active = function (state) {
        return utils_1.blockActive(state.schema.nodes.heading)(state);
    };
    Heading.prototype.enable = function (state) {
        return prosemirror_commands_1.setBlockType(state.schema.nodes.heading)(state);
    };
    Heading.prototype.customMenu = function (_a) {
        var state = _a.state, dispatch = _a.dispatch;
        var node = utils_1.getParentNodeFromState(state);
        return (React.createElement(React.Fragment, null,
            this._sizes.map(function (hsize) { return (React.createElement(button_1.default, { key: hsize, active: node && node.attrs.hsize === hsize, type: "button", onClick: function () {
                    prosemirror_commands_1.setBlockType(state.schema.nodes.heading, __assign(__assign({}, node.attrs), { hsize: hsize }))(state, dispatch);
                } },
                React.createElement("strong", { style: { fontFamily: 'Consolas, Menlo, sans-serif', fontSize: '1rem' } }, hsize))); }),
            React.createElement(button_1.default, { type: "button", active: node && node.attrs.usehtag, title: "use h-tag", onClick: function () {
                    prosemirror_commands_1.setBlockType(state.schema.nodes.heading, __assign(__assign({}, node.attrs), { usehtag: node.attrs.usehtag ? '' : 'true' }))(state, dispatch);
                } },
                React.createElement("strong", { style: { fontFamily: 'Consolas, Menlo, sans-serif', fontSize: '1rem' } }, "<h>"))));
    };
    Heading.prototype.onClick = function (state, dispatch) {
        prosemirror_commands_1.setBlockType(state.schema.nodes.heading)(state, dispatch);
    };
    return Heading;
}(types_1.Extension));
exports.default = Heading;
//# sourceMappingURL=heading.js.map