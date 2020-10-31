"use strict";
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
var prosemirror_state_1 = require("prosemirror-state");
var react_dom_1 = require("react-dom");
var tooltip_react_1 = require("./tooltip-react");
var utils_1 = require("../../utils");
var TOOLTIP_WIDTH = 92;
var filterAttrs = function (attrs) { return Object.entries(attrs).reduce(function (res, _a) {
    var k = _a[0], v = _a[1];
    if (v && k !== 'editing')
        res[k] = v;
    return res;
}, {}); };
var clamp = function (v, min, max) { return v < min ? min : v > max ? max : v; };
var linkPos = null;
var TooltipComponent = function (props) {
    var view = props.view, openDialog = props.openDialog;
    var state = view.state;
    var selection = state.selection;
    var from = selection.from, to = selection.to, $head = selection.$head;
    var link = utils_1.getMarkInSelection('link', state);
    if (from === to || !link || !link.attrs.editing) {
        if (linkPos && (!link || link.attrs.editing)) {
            var tr = state.tr;
            tr.removeMark(linkPos.from, linkPos.to, state.schema.marks.link);
            view.dispatch(tr);
        }
        linkPos = null;
        return null;
    }
    linkPos = { from: from, to: to };
    var attrs = filterAttrs(link.attrs);
    var onOk = function (attrs) {
        var tr = state.tr;
        tr.removeMark(from, to, state.schema.marks.link);
        tr.addMark(from, to, state.schema.marks.link.create(__assign(__assign({}, attrs), { editing: '' })));
        view.dispatch(tr);
    };
    var onCancel = function () {
        var tr = state.tr;
        tr.removeMark(from, to, state.schema.marks.link);
        if (Object.values(attrs).some(function (v) { return v; })) {
            tr.addMark(from, to, view.state.schema.marks.link.create(__assign(__assign({}, attrs), { editing: '' })));
        }
        view.dispatch(tr);
    };
    var onEdit = function () {
        console.log('onEdit');
        openDialog(onOk, onCancel, attrs);
    };
    var onDel = function () {
        var tr = state.tr;
        tr.removeMark(from, to, state.schema.marks.link);
        view.dispatch(tr);
    };
    var coords = view.coordsAtPos($head.pos);
    var top = coords.top + utils_1.getScrollTop() + 43;
    var left = clamp(coords.left - 30, 0, window.innerWidth - TOOLTIP_WIDTH);
    return (React.createElement("div", { className: "smartblock-tooltip-wrap", style: { left: left, top: top } },
        React.createElement("div", { className: "smartblock-tooltip-wrap-arrow", style: { left: 20 } }),
        React.createElement(tooltip_react_1.default, { onDel: onDel, onEdit: onEdit })));
};
var Tooltip = /** @class */ (function () {
    function Tooltip(_a) {
        var attributes = _a.attributes, openDialog = _a.openDialog, view = _a.view;
        this._attributes = attributes;
        this._openDialog = openDialog;
        this.tooltip = document.createElement('div');
        document.body.appendChild(this.tooltip);
        this.update(view);
    }
    Tooltip.prototype.render = function (view) {
        react_dom_1.render(React.createElement(TooltipComponent, { view: view, attributes: this._attributes, openDialog: this._openDialog }), this.tooltip);
    };
    Tooltip.prototype.update = function (view) {
        this.render(view);
    };
    Tooltip.prototype.destroy = function () {
        react_dom_1.unmountComponentAtNode(this.tooltip);
        document.body.removeChild(this.tooltip);
    };
    return Tooltip;
}());
exports.default = (function (_a) {
    var attributes = _a.attributes, openDialog = _a.openDialog;
    return new prosemirror_state_1.Plugin({
        view: function (view) {
            return new Tooltip({ attributes: attributes, openDialog: openDialog, view: view });
        }
    });
});
//# sourceMappingURL=tooltip.js.map