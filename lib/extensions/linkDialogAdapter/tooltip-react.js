"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var trash_1 = require("../../components/icons/trash");
var edit_1 = require("../../components/icons/edit");
exports.default = (function (props) { return (React.createElement("div", { className: "smartblock-link-dialog-tooltip" },
    React.createElement("div", { className: "smartblock-tooltip-inner" },
        React.createElement("button", { className: "smartblock-tooltip-btn", onClick: props.onEdit, style: { paddingLeft: '7px' } },
            React.createElement(edit_1.default, { style: { width: '24px', height: '24px', overflow: 'hidden' } })),
        React.createElement("button", { className: "smartblock-tooltip-btn", onClick: props.onDel, style: { paddingLeft: '7px' } },
            React.createElement(trash_1.default, { fill: "#fff", style: { width: '24px', height: '24px', overflow: 'hidden' } }))))); });
//# sourceMappingURL=tooltip-react.js.map