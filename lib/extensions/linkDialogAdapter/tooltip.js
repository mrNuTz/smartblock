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
var useRef = React.useRef;
var ARROWOFFSET = 50;
var ARROWTOPOFFSET = 33;
var TOOLTIP_WIDTH = 92;
var calculateStyle = function (view) {
    var selection = view.state.selection;
    var app = view.dom;
    var $anchor = view.state.selection.$anchor;
    var nodeAfter = $anchor.nodeAfter;
    var link = null;
    if (nodeAfter) {
        link = nodeAfter.marks.find(function (mark) {
            if (mark.type.name === 'link') {
                return true;
            }
        });
    }
    if (!selection || selection.empty || !app || !link) {
        return {
            left: -1000,
            top: 0
        };
    }
    var coords = view.coordsAtPos(selection.$head.pos);
    var top = coords.top + utils_1.getScrollTop() + ARROWTOPOFFSET;
    var left = coords.left - ARROWOFFSET;
    var width = TOOLTIP_WIDTH; // container.current.offsetWidth
    return {
        left: (left + width > window.innerWidth) ? window.innerWidth - width : left,
        top: top
    };
};
var calculatePos = function (view) {
    var selection = view.state.selection;
    var app = view.dom;
    var $anchor = view.state.selection.$anchor;
    var nodeAfter = $anchor.nodeAfter;
    var link = null;
    if (nodeAfter) {
        link = nodeAfter.marks.find(function (mark) {
            if (mark.type.name === 'link') {
                return true;
            }
            return false;
        });
    }
    if (!selection || selection.empty || !app || !link) {
        return 20;
    }
    var coords = view.coordsAtPos(selection.$head.pos);
    var left = coords.left - ARROWOFFSET;
    var width = TOOLTIP_WIDTH; // container.current.offsetWidth
    if (left + width > window.innerWidth) {
        return left - window.innerWidth + width;
    }
    return 20;
};
var filterAttrs = function (attrs) { return Object.entries(attrs).reduce(function (res, _a) {
    var k = _a[0], v = _a[1];
    if (v && k !== 'editing')
        res[k] = v;
    return res;
}, {}); };
var TooltipComponent = function (props) {
    var view = props.view, openDialog = props.openDialog;
    var container = useRef(null);
    var style = calculateStyle(view);
    var selection = view.state.selection;
    var $anchor = selection.$anchor;
    var nodeBefore = $anchor.nodeBefore, nodeAfter = $anchor.nodeAfter, pos = $anchor.pos;
    var link = null;
    var editing = '';
    if (nodeAfter) {
        link = nodeAfter.marks.find(function (mark) {
            if (mark.type.name === 'link') {
                return true;
            }
        });
    }
    var attrs = {};
    if (link) {
        attrs = filterAttrs(link.attrs);
        editing = link.attrs.editing;
    }
    var beforePos = selection.from;
    var afterPos = selection.to;
    if (beforePos === afterPos && nodeBefore && nodeAfter) {
        beforePos = pos - nodeBefore.nodeSize;
        afterPos = pos + nodeAfter.nodeSize;
    }
    var arrowPos = calculatePos(view);
    var onOk = function (attrs) {
        var tr = view.state.tr;
        tr.removeMark(beforePos, afterPos, view.state.schema.marks.link);
        tr.addMark(beforePos, afterPos, view.state.schema.marks.link.create(__assign(__assign({}, attrs), { editing: '' })));
        view.dispatch(tr);
    };
    var onCancel = function () {
        var tr = view.state.tr;
        tr.removeMark(beforePos, afterPos, view.state.schema.marks.link);
        if (link.href) {
            tr.addMark(beforePos, afterPos, view.state.schema.marks.link.create(__assign(__assign({}, attrs), { editing: '' })));
        }
        view.dispatch(tr);
    };
    var onEdit = function () { return openDialog(onOk, onCancel, attrs); };
    var onDel = function () {
        var tr = view.state.tr;
        tr.removeMark(beforePos, afterPos, view.state.schema.marks.link);
        view.dispatch(tr);
    };
    return (React.createElement("div", { className: "smartblock-tooltip-wrap", ref: container, style: style },
        React.createElement("div", { className: "smartblock-tooltip-arrow", style: { left: arrowPos + "px" } }),
        editing === 'true' &&
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