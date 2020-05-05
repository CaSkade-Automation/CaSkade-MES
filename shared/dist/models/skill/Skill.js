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
exports.__esModule = true;
var RdfElement_1 = require("../RdfElement");
var Skill = /** @class */ (function (_super) {
    __extends(Skill, _super);
    function Skill(iri, stateMachine, currentState) {
        var _this = _super.call(this, iri) || this;
        _this.stateMachine = stateMachine;
        _this.currentState = currentState;
        return _this;
    }
    return Skill;
}(RdfElement_1.RdfElement));
exports.Skill = Skill;
