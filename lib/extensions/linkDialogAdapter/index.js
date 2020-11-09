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
var prosemirror_commands_1 = require("prosemirror-commands");
var link_1 = require("../../components/icons/link");
var types_1 = require("../../types");
var utils_1 = require("../../utils");
var tooltip_1 = require("./tooltip");
var LinkDialogAdapter = /** @class */ (function (_super) {
    __extends(LinkDialogAdapter, _super);
    function LinkDialogAdapter(props) {
        var _this = _super.call(this, props) || this;
        _this.name = 'link';
        _this.group = 'mark';
        _this.showMenu = true;
        _this._openDialog = props.openDialog;
        _this._attributes = props.attributes.includes('href')
            ? props.attributes
            : props.attributes.concat('href');
        return _this;
    }
    Object.defineProperty(LinkDialogAdapter.prototype, "schema", {
        get: function () {
            var _this = this;
            if (this.customSchema) {
                return this.customSchema;
            }
            return {
                group: 'mark',
                attrs: (this._attributes.concat('editing').reduce(function (attrs, attr) {
                    attrs[attr] = { default: '' };
                    return attrs;
                }, {})),
                inclusive: false,
                parseDOM: [
                    {
                        tag: 'a[href]:not(.embed)',
                        getAttrs: function (dom) {
                            return _this._attributes.concat('editing').reduce(function (attrs, attr) {
                                attrs[attr] = dom.getAttribute(attr);
                                return attrs;
                            }, {});
                        }
                    }
                ],
                toDOM: function (node) {
                    return ['a', node.attrs, 0];
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkDialogAdapter.prototype, "icon", {
        get: function () {
            return React.createElement(link_1.default, { style: { width: '24px', height: '24px' } });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkDialogAdapter.prototype, "plugins", {
        get: function () {
            return [tooltip_1.default({ openDialog: this._openDialog, attributes: this._attributes })];
        },
        enumerable: false,
        configurable: true
    });
    LinkDialogAdapter.prototype.active = function (state) {
        return false;
    };
    LinkDialogAdapter.prototype.enable = function (state) {
        return !utils_1.markActive(state.schema.marks.link)(state);
    };
    LinkDialogAdapter.prototype.onClick = function (state, dispatch) {
        if (!utils_1.markActive(state.schema.marks.link)(state)) {
            prosemirror_commands_1.toggleMark(state.schema.marks.link, { href: '', editing: 'true' })(state, dispatch);
        }
    };
    return LinkDialogAdapter;
}(types_1.Extension));
exports.default = LinkDialogAdapter;
//# sourceMappingURL=index.js.map