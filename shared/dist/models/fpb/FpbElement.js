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
var FpbElement = /** @class */ (function (_super) {
    __extends(FpbElement, _super);
    function FpbElement(iri) {
        return _super.call(this, iri) || this;
    }
    return FpbElement;
}(RdfElement_1.RdfElement));
exports.FpbElement = FpbElement;
// TODO: There is currently no specialization for the three different FpbElements
var Information = /** @class */ (function (_super) {
    __extends(Information, _super);
    function Information(iri) {
        return _super.call(this, iri) || this;
    }
    return Information;
}(FpbElement));
exports.Information = Information;
var Energy = /** @class */ (function (_super) {
    __extends(Energy, _super);
    function Energy(iri) {
        return _super.call(this, iri) || this;
    }
    return Energy;
}(FpbElement));
exports.Energy = Energy;
var Product = /** @class */ (function (_super) {
    __extends(Product, _super);
    function Product(iri) {
        return _super.call(this, iri) || this;
    }
    return Product;
}(FpbElement));
exports.Product = Product;
