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
var trash_1 = require("../../components/icons/trash");
var edit_1 = require("../../components/icons/edit");
var react_dom_1 = require("react-dom");
var utils_1 = require("../../utils");
var TOOLTIP_WIDTH = 92;
var ARROWOFFSET = 30;
var ARROWTOPOFFSET = 43;
var calcTopLeft = function (view) {
    var selection = view.state.selection;
    var offsetLeft = utils_1.getOffset(view.dom).left;
    var coords = view.coordsAtPos(selection.$head.pos);
    var offsetTop = utils_1.getOffset(view.dom).top;
    var top = coords.top + utils_1.getScrollTop() + ARROWTOPOFFSET - offsetTop;
    var left = coords.left - ARROWOFFSET - offsetLeft;
    var width = TOOLTIP_WIDTH;
    if (left + width > view.dom.clientWidth) {
        left = view.dom.clientWidth - width;
    }
    else if (left < 0) {
        left = 0;
    }
    return { left: left, top: top };
};
var calculateArrowPos = function (view) {
    var selection = view.state.selection;
    var offsetLeft = utils_1.getOffset(view.dom).left;
    var coords = view.coordsAtPos(selection.$head.pos);
    var left = coords.left - ARROWOFFSET - offsetLeft;
    var width = TOOLTIP_WIDTH;
    if (left + width > view.dom.clientWidth) {
        return left - view.dom.clientWidth + width + 20;
    }
    return 20;
};
var TooltipComponent = function (props) {
    var show = props.show, onDel = props.onDel, onEdit = props.onEdit, view = props.view;
    return !!show && (React.createElement("div", { className: "smartblock-tooltip-wrap", style: calcTopLeft(view) },
        React.createElement("div", { className: "smartblock-tooltip-wrap-arrow", style: { left: calculateArrowPos(view) } }),
        React.createElement("div", { className: "smartblock-link-dialog-tooltip" },
            React.createElement("div", { className: "smartblock-tooltip-inner" },
                React.createElement("button", { className: "smartblock-tooltip-btn", onClick: onEdit, style: { paddingLeft: '7px' } },
                    React.createElement(edit_1.default, { style: { width: '24px', height: '24px', overflow: 'hidden' } })),
                React.createElement("button", { className: "smartblock-tooltip-btn", onClick: onDel, style: { paddingLeft: '7px' } },
                    React.createElement(trash_1.default, { fill: "#fff", style: { width: '24px', height: '24px', overflow: 'hidden' } }))))));
};
var filterAttrs = function (attrs, attributes) { return Object.entries(attrs).reduce(function (res, _a) {
    var k = _a[0], v = _a[1];
    if (v && k !== 'editing' && attributes.includes(k))
        res[k] = v;
    return res;
}, {}); };
var getSelectedLink = function (view, attributes) {
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
        coords: view.coordsAtPos(to),
    };
};
var Tooltip = /** @class */ (function () {
    function Tooltip(_a) {
        var _this = this;
        var attributes = _a.attributes, openDialog = _a.openDialog, view = _a.view;
        this._storedLink = null;
        this._dialogOpen = false;
        this._onDel = function (view) { return function () {
            if (_this._dialogOpen)
                return;
            var tr = view.state.tr;
            tr.removeMark(_this._storedLink.from, _this._storedLink.to, view.state.schema.marks.link);
            _this._storedLink = null;
            view.dispatch(tr);
        }; };
        this._onEdit = function (view) { return function () {
            if (_this._dialogOpen)
                return;
            var onOk = function (attrs) {
                var tr = view.state.tr;
                tr.removeMark(_this._storedLink.from, _this._storedLink.to, view.state.schema.marks.link);
                tr.addMark(_this._storedLink.from, _this._storedLink.to, view.state.schema.marks.link.create(__assign(__assign({}, attrs), { editing: '' })));
                tr.setSelection(new prosemirror_state_1.TextSelection(tr.doc.resolve(_this._storedLink.to + 2)));
                _this._dialogOpen = false;
                _this._storedLink = null;
                view.dispatch(tr);
            };
            var onCancel = function () {
                var tr = view.state.tr;
                tr.removeMark(_this._storedLink.from, _this._storedLink.to, view.state.schema.marks.link);
                if (Object.values(_this._storedLink.attrs).some(function (v) { return v; })) {
                    tr.addMark(_this._storedLink.from, _this._storedLink.to, view.state.schema.marks.link.create(__assign(__assign({}, _this._storedLink.attrs), { editing: '' })));
                }
                _this._dialogOpen = false;
                _this._storedLink = null;
                view.dispatch(tr);
            };
            _this._dialogOpen = true;
            _this._openDialog(onOk, onCancel, _this._storedLink.attrs);
        }; };
        this._attributes = attributes;
        this._openDialog = openDialog;
        this._tooltip = document.createElement('div');
        this._tooltip.className = 'link-tooltip';
        this.update(view);
    }
    Tooltip.prototype.update = function (view) {
        var selectedLink = getSelectedLink(view, this._attributes);
        if (!this._container) {
            var container = view.dom.closest('.smartblock-container');
            if (container) {
                this._container = container.querySelector('.plugin-toolbar-container');
                this._container.appendChild(this._tooltip);
            }
        }
        if ((!this._storedLink || !this._storedLink.editing) && selectedLink && !this._dialogOpen) {
            this._storedLink = selectedLink;
        }
        else if (this._storedLink && !this._dialogOpen
            && (!selectedLink || selectedLink.from !== this._storedLink.from)) {
            if (this._storedLink.editing) {
                var tr = view.state.tr;
                tr.removeMark(this._storedLink.from, this._storedLink.to, view.state.schema.marks.link);
                this._storedLink = null;
                view.dispatch(tr);
                return;
            }
            this._storedLink = null;
        }
        react_dom_1.render(React.createElement(TooltipComponent, { show: !!this._storedLink, onDel: this._onDel(view), onEdit: this._onEdit(view), view: view }), this._tooltip);
    };
    Tooltip.prototype.destroy = function () {
        react_dom_1.unmountComponentAtNode(this._tooltip);
        this._container.removeChild(this._tooltip);
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