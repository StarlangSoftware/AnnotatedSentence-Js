(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Language = void 0;
    var Language;
    (function (Language) {
        Language[Language["TURKISH"] = 0] = "TURKISH";
        Language[Language["ENGLISH"] = 1] = "ENGLISH";
        Language[Language["PERSIAN"] = 2] = "PERSIAN";
    })(Language = exports.Language || (exports.Language = {}));
});
//# sourceMappingURL=Language.js.map