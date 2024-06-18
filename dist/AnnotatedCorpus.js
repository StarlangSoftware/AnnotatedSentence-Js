(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-corpus/dist/Corpus", "fs", "./AnnotatedSentence", "nlptoolkit-dependencyparser/dist/ParserEvaluationScore"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnnotatedCorpus = void 0;
    const Corpus_1 = require("nlptoolkit-corpus/dist/Corpus");
    const fs = require("fs");
    const AnnotatedSentence_1 = require("./AnnotatedSentence");
    const ParserEvaluationScore_1 = require("nlptoolkit-dependencyparser/dist/ParserEvaluationScore");
    class AnnotatedCorpus extends Corpus_1.Corpus {
        /**
         * A constructor of {@link AnnotatedCorpus} class which reads all {@link AnnotatedSentence} files with the file
         * name satisfying the given pattern inside the given folder. For each file inside that folder, the constructor
         * creates an AnnotatedSentence and puts in inside the list parseTrees.
         * @param folder Folder where all sentences reside.
         * @param pattern File pattern such as "." ".train" ".test".
         */
        constructor(folder, pattern) {
            super();
            let files = fs.readdirSync(folder);
            files.sort();
            for (let file of files) {
                if (pattern != undefined) {
                    if (!file.includes(pattern)) {
                        continue;
                    }
                }
                let sentence = new AnnotatedSentence_1.AnnotatedSentence(folder + "/" + file);
                this.sentences.push(sentence);
            }
        }
        /**
         * Compares the corpus with the given corpus and returns a parser evaluation score for this comparison. The result
         * is calculated by summing up the parser evaluation scores of sentence by sentence dependency relation comparisons.
         * @param corpus Corpus to be compared.
         * @return A parser evaluation score object.
         */
        compareParses(corpus) {
            let result = new ParserEvaluationScore_1.ParserEvaluationScore();
            for (let i = 0; i < this.sentences.length; i++) {
                let sentence1 = this.sentences[i];
                let sentence2 = corpus.getSentence(i);
                result.add(sentence1.compareParses(sentence2));
            }
            return result;
        }
    }
    exports.AnnotatedCorpus = AnnotatedCorpus;
});
//# sourceMappingURL=AnnotatedCorpus.js.map