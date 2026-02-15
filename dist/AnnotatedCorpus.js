"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotatedCorpus = void 0;
const Corpus_1 = require("nlptoolkit-corpus/dist/Corpus");
const fs = __importStar(require("fs"));
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
//# sourceMappingURL=AnnotatedCorpus.js.map