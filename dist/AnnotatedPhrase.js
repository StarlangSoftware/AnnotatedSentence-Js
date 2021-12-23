(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-corpus/dist/Sentence"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnnotatedPhrase = void 0;
    const Sentence_1 = require("nlptoolkit-corpus/dist/Sentence");
    class AnnotatedPhrase extends Sentence_1.Sentence {
        /**
         * Constructor for AnnotatedPhrase. AnnotatedPhrase stores information about phrases such as
         * Shallow Parse phrases or named entity phrases.
         * @param wordIndex Starting index of the first word in the phrase w.r.t. original sentence the phrase occurs.
         * @param tag Tag of the phrase. Corresponds to the shallow parse or named entity tag.
         */
        constructor(wordIndex, tag) {
            super();
            this.wordIndex = wordIndex;
            this.tag = tag;
        }
        /**
         * Accessor for the wordIndex attribute.
         * @return Starting index of the first word in the phrase w.r.t. original sentence the phrase occurs.
         */
        getWordIndex() {
            return this.wordIndex;
        }
        /**
         * Accessor for the tag attribute.
         * @return Tag of the phrase. Corresponds to the shallow parse or named entity tag.
         */
        getTag() {
            return this.tag;
        }
    }
    exports.AnnotatedPhrase = AnnotatedPhrase;
});
//# sourceMappingURL=AnnotatedPhrase.js.map