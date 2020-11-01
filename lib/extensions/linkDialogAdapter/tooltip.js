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
var filterAttrs = function (attrs, attributes) { return Object.entries(attrs).reduce(function (res, _a) {
    var k = _a[0], v = _a[1];
    if (v && k !== 'editing' && attributes.includes(k))
        res[k] = v;
    return res;
}, {}); };
var clamp = function (v, min, max) { return v < min ? min : v > max ? max : v; };
var calcTopLeft = function (coords) {
    var top = coords.top + utils_1.getScrollTop() + 43;
    var left = clamp(coords.left - 30, 0, window.innerWidth - TOOLTIP_WIDTH);
    return { top: top, left: left };
};
var storedLink = null;
var dialogOpen = false;
var getHeadLink = function (view, attributes) {
    var _a = view.state.selection, $head = _a.$head, head = _a.head;
    var nodeBefore = $head.nodeBefore, nodeAfter = $head.nodeAfter;
    var link = (nodeBefore && nodeBefore.marks.find(function (m) { return m.type.name === 'link'; }))
        || (nodeAfter && nodeAfter.marks.find(function (m) { return m.type.name === 'link'; }))
        || null;
    if (!link)
        return null;
    var from = head;
    var to = head;
    if (nodeBefore && nodeBefore.marks.some(function (m) { return m.type.name === 'link'; }))
        from -= nodeBefore.nodeSize;
    if (nodeAfter && nodeAfter.marks.some(function (m) { return m.type.name === 'link'; }))
        to += nodeAfter.nodeSize;
    return {
        from: from,
        to: to,
        attrs: filterAttrs(link.attrs, attributes),
        editing: link.attrs.editing,
        coords: view.coordsAtPos(from),
    };
};
var TooltipComponent = function (props) {
    var view = props.view, openDialog = props.openDialog, attributes = props.attributes;
    var selectedLink = getHeadLink(view, attributes);
    if ((!storedLink || !storedLink.editing) && selectedLink && !dialogOpen) {
        storedLink = selectedLink;
    }
    else if (storedLink && !selectedLink && !dialogOpen) {
        if (storedLink.editing) {
            var tr = view.state.tr;
            tr.removeMark(storedLink.from, storedLink.to, view.state.schema.marks.link);
            view.dispatch(tr);
        }
        storedLink = null;
    }
    var onDel = function () {
        if (dialogOpen)
            return;
        var tr = view.state.tr;
        tr.removeMark(storedLink.from, storedLink.to, view.state.schema.marks.link);
        storedLink = null;
        view.dispatch(tr);
    };
    var onEdit = function () {
        if (dialogOpen)
            return;
        var onOk = function (attrs) {
            var tr = view.state.tr;
            tr.removeMark(storedLink.from, storedLink.to, view.state.schema.marks.link);
            tr.addMark(storedLink.from, storedLink.to, view.state.schema.marks.link.create(__assign(__assign({}, attrs), { editing: '' })));
            dialogOpen = false;
            storedLink = null;
            view.dispatch(tr);
        };
        var onCancel = function () {
            var tr = view.state.tr;
            tr.removeMark(storedLink.from, storedLink.to, view.state.schema.marks.link);
            if (Object.values(storedLink.attrs).some(function (v) { return v; })) {
                tr.addMark(storedLink.from, storedLink.to, view.state.schema.marks.link.create(__assign(__assign({}, storedLink.attrs), { editing: '' })));
            }
            dialogOpen = false;
            storedLink = null;
            view.dispatch(tr);
        };
        dialogOpen = true;
        openDialog(onOk, onCancel, storedLink.attrs);
    };
    return !!storedLink && (React.createElement("div", { className: "smartblock-tooltip-wrap", style: calcTopLeft(storedLink.coords) },
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