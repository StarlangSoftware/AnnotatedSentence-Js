(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-corpus/dist/Sentence", "fs", "./AnnotatedWord", "./AnnotatedPhrase", "nlptoolkit-dependencyparser/dist/ParserEvaluationScore"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnnotatedSentence = void 0;
    const Sentence_1 = require("nlptoolkit-corpus/dist/Sentence");
    const fs = require("fs");
    const AnnotatedWord_1 = require("./AnnotatedWord");
    const AnnotatedPhrase_1 = require("./AnnotatedPhrase");
    const ParserEvaluationScore_1 = require("nlptoolkit-dependencyparser/dist/ParserEvaluationScore");
    class AnnotatedSentence extends Sentence_1.Sentence {
        /**
         * Reads an annotated sentence from a text file.
         * Converts a simple sentence to an annotated sentence.
         * @param param File containing the annotated sentence. OR Simple sentence.
         */
        constructor(param) {
            super();
            this.words = [];
            if (param !== undefined) {
                if (param.includes(".txt") || param.includes(".train") ||
                    param.includes(".dev") || param.includes(".test")) {
                    let fileName = param;
                    if (fileName !== undefined) {
                        this.file = fileName;
                        let data = fs.readFileSync(fileName, 'utf8');
                        let wordList = data.split("\n")[0].split(" ");
                        for (let word of wordList) {
                            this.words.push(new AnnotatedWord_1.AnnotatedWord(word));
                        }
                    }
                }
                else {
                    let wordList = param.split(" ");
                    for (let word of wordList) {
                        if (word !== "") {
                            this.words.push(new AnnotatedWord_1.AnnotatedWord(word));
                        }
                    }
                }
            }
        }
        /**
         * Returns file name of the sentence
         * @return File name of the sentence
         */
        getFileName() {
            return this.file;
        }
        /**
         * The method constructs all possible shallow parse groups of a sentence.
         * @return Shallow parse groups of a sentence.
         */
        getShallowParseGroups() {
            let shallowParseGroups = new Array();
            let previousWord = undefined;
            let current = undefined;
            for (let i = 0; i < this.wordCount(); i++) {
                let annotatedWord = this.getWord(i);
                if (previousWord == null) {
                    current = new AnnotatedPhrase_1.AnnotatedPhrase(i, annotatedWord.getShallowParse());
                }
                else {
                    if (previousWord.getShallowParse() != null && previousWord.getShallowParse() != annotatedWord.getShallowParse()) {
                        shallowParseGroups.push(current);
                        current = new AnnotatedPhrase_1.AnnotatedPhrase(i, annotatedWord.getShallowParse());
                    }
                }
                current.addWord(annotatedWord);
                previousWord = annotatedWord;
            }
            shallowParseGroups.push(current);
            return shallowParseGroups;
        }
        /**
         * The method checks all words in the sentence and returns true if at least one of the words is annotated with
         * PREDICATE tag.
         * @return True if at least one of the words is annotated with PREDICATE tag; false otherwise.
         */
        containsPredicate() {
            for (let word of this.words) {
                let annotatedWord = word;
                if (annotatedWord.getArgumentList() != undefined) {
                    if (annotatedWord.getArgumentList().containsPredicate()) {
                        return true;
                    }
                }
            }
            return false;
        }
        /**
         * The method checks all words in the sentence and returns true if at least one of the words is annotated with
         * PREDICATE tag.
         * @return True if at least one of the words is annotated with PREDICATE tag; false otherwise.
         */
        containsFramePredicate() {
            for (let word of this.words) {
                let annotatedWord = word;
                if (annotatedWord.getFrameElementList() != undefined) {
                    if (annotatedWord.getFrameElementList().containsPredicate()) {
                        return true;
                    }
                }
            }
            return false;
        }
        /**
         * Replaces id's of predicates, which have previousId as synset id, with currentId. Replaces also predicate id's of
         * frame elements, which have predicate id's previousId, with currentId.
         * @param previousId Previous id of the synset.
         * @param currentId Replacement id.
         * @return Returns true, if any replacement has been done; false otherwise.
         */
        updateConnectedPredicate(previousId, currentId) {
            let modified = false;
            for (let word of this.words) {
                let annotatedWord = word;
                let argumentList = annotatedWord.getArgumentList();
                if (argumentList != undefined) {
                    if (argumentList.containsPredicateWithId(previousId)) {
                        argumentList.updateConnectedId(previousId, currentId);
                        modified = true;
                    }
                }
                let frameElementList = annotatedWord.getFrameElementList();
                if (frameElementList != undefined) {
                    if (frameElementList.containsPredicateWithId(previousId)) {
                        frameElementList.updateConnectedId(previousId, currentId);
                        modified = true;
                    }
                }
            }
            return modified;
        }
        /**
         * The method returns all possible words, which is
         * 1. Verb
         * 2. Its semantic tag is assigned
         * 3. A frameset exists for that semantic tag
         * @param framesetList Frameset list that contains all frames for Turkish
         * @return An array of words, which are verbs, semantic tags assigned, and framesetlist assigned for that tag.
         */
        predicateCandidates(framesetList) {
            let candidateList = new Array();
            for (let word of this.words) {
                let annotatedWord = word;
                if (annotatedWord.getParse() != undefined && annotatedWord.getParse().isVerb() &&
                    annotatedWord.getSemantic() != undefined && framesetList.frameExists(annotatedWord.getSemantic())) {
                    candidateList.push(annotatedWord);
                }
            }
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < this.words.length - i - 1; j++) {
                    let annotatedWord = this.words[j];
                    let nextAnnotatedWord = this.words[j + 1];
                    if (!candidateList.includes(annotatedWord) && candidateList.includes(nextAnnotatedWord) &&
                        annotatedWord.getSemantic() != undefined && annotatedWord.getSemantic() == nextAnnotatedWord.getSemantic()) {
                        candidateList.push(annotatedWord);
                    }
                }
            }
            return candidateList;
        }
        /**
         * The method returns all possible words, which is
         * 1. Verb
         * 2. Its semantic tag is assigned
         * 3. A frameset exists for that semantic tag
         * @param frameNet FrameNet list that contains all frames for Turkish
         * @return An array of words, which are verbs, semantic tags assigned, and framenet assigned for that tag.
         */
        predicateFrameCandidates(frameNet) {
            let candidateList = new Array();
            for (let word of this.words) {
                let annotatedWord = word;
                if (annotatedWord.getParse() != undefined && annotatedWord.getParse().isVerb() &&
                    annotatedWord.getSemantic() != undefined && frameNet.lexicalUnitExists(annotatedWord.getSemantic())) {
                    candidateList.push(annotatedWord);
                }
            }
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < this.words.length - i - 1; j++) {
                    let annotatedWord = this.words[j];
                    let nextAnnotatedWord = this.words[j + 1];
                    if (!candidateList.includes(annotatedWord) && candidateList.includes(nextAnnotatedWord) &&
                        annotatedWord.getSemantic() != undefined && annotatedWord.getSemantic() == nextAnnotatedWord.getSemantic()) {
                        candidateList.push(annotatedWord);
                    }
                }
            }
            return candidateList;
        }
        /**
         * Returns the i'th predicate in the sentence.
         * @param index Predicate index
         * @return The predicate with index index in the sentence.
         */
        getPredicate(index) {
            let count1 = 0, count2 = 0;
            let data = "";
            let word = new Array();
            let parse = new Array();
            if (index < this.wordCount()) {
                for (let i = 0; i < this.wordCount(); i++) {
                    word.push(this.getWord(i));
                    parse.push(word[i].getParse());
                }
                for (let i = index; i >= 0; i--) {
                    if (parse[i] != undefined && parse[i].getRootPos() != undefined &&
                        parse[i].getPos() != undefined && parse[i].getRootPos() == "VERB" &&
                        parse[i].getPos() == "VERB") {
                        count1 = index - i;
                        break;
                    }
                }
                for (let i = index; i < this.wordCount() - index; i++) {
                    if (parse[i] != undefined && parse[i].getRootPos() != undefined &&
                        parse[i].getPos() != undefined && parse[i].getRootPos() == "VERB" &&
                        parse[i].getPos() == "VERB") {
                        count2 = i - index;
                        break;
                    }
                }
                if (count1 > count2) {
                    data = word[count1].getName();
                }
                else {
                    data = word[count2].getName();
                }
            }
            return data;
        }
        /**
         * Removes the i'th word from the sentence
         * @param index Word index
         */
        removeWord(index) {
            for (let value of this.words) {
                let word = value;
                if (word.getUniversalDependency() != undefined) {
                    if (word.getUniversalDependency().to() == index + 1) {
                        word.setUniversalDependency(-1, "ROOT");
                    }
                    else {
                        if (word.getUniversalDependency().to() > index + 1) {
                            word.setUniversalDependency(word.getUniversalDependency().to() - 1, word.getUniversalDependency().toString());
                        }
                    }
                }
            }
            this.words.splice(index, 1);
        }
        /**
         * The toStems method returns an accumulated string of each word's stems in words {@link Array}.
         * If the parse of the word does not exist, the method adds the surfaceform to the resulting string.
         *
         * @return String result which has all the stems of each item in words {@link Array}.
         */
        toStems() {
            if (this.words.length > 0) {
                let annotatedWord = this.words[0];
                let result;
                if (annotatedWord.getParse() != null) {
                    result = annotatedWord.getParse().getWord().getName();
                }
                else {
                    result = annotatedWord.getName();
                }
                for (let i = 1; i < this.words.length; i++) {
                    annotatedWord = this.words[i];
                    if (annotatedWord.getParse() != undefined) {
                        result = result + " " + annotatedWord.getParse().getWord().getName();
                    }
                    else {
                        result = result + " " + annotatedWord.getName();
                    }
                }
                return result;
            }
            else {
                return "";
            }
        }
        /**
         * Creates a html string for the annotated sentence, where the dependency relation of the word with the give
         * wordIndex is specified with color codes. The parameter word is drawn in red color, the dependent word is
         * drawn in blue color.
         * @param wordIndex The word for which the dependency relation will be displayed.
         * @return Html string.
         */
        toDependencyString(wordIndex) {
            let sentenceString = "";
            let word = this.getWord(wordIndex);
            for (let k = 0; k < this.words.length; k++) {
                if (wordIndex == k) {
                    sentenceString += " <b><font color=\"red\">" + this.words[k].getName() + "</font></b>";
                }
                else {
                    if (k + 1 == word.getUniversalDependency().to()) {
                        sentenceString += " <b><font color=\"blue\">" + this.words[k].getName() + "</font></b>";
                    }
                    else {
                        sentenceString += " " + this.words[k].getName();
                    }
                }
            }
            return sentenceString;
        }
        /**
         * Creates a shallow parse string for the annotated sentence, where the shallow parse of the word with the give
         * wordIndex and the surrounding words with the same shallow parse tag are specified with blue color.
         * @param wordIndex The word for which the shallow parse tag will be displayed.
         * @return Html string.
         */
        toShallowParseString(wordIndex) {
            let sentenceString = "";
            let word = this.getWord(wordIndex);
            let startIndex = wordIndex - 1;
            while (startIndex >= 0 && this.words[startIndex].getShallowParse() != undefined &&
                this.words[startIndex].getShallowParse() == word.getShallowParse()) {
                startIndex--;
            }
            startIndex++;
            let endIndex = wordIndex + 1;
            while (endIndex < this.words.length && this.words[endIndex].getShallowParse() != undefined &&
                this.words[endIndex].getShallowParse() == word.getShallowParse()) {
                endIndex++;
            }
            endIndex--;
            for (let k = 0; k < this.words.length; k++) {
                if (k >= startIndex && k <= endIndex) {
                    sentenceString += " <b><font color=\"blue\">" + this.words[k].getName() + "</font></b>";
                }
                else {
                    sentenceString += " " + this.words[k].getName();
                }
            }
            return sentenceString;
        }
        /**
         * Creates a html string for the annotated sentence, where the named entity of the word with the give
         * wordIndex and the surrounding words with the same named entity tag are specified with blue color.
         * @param wordIndex The word for which the named entity tag will be displayed.
         * @return Html string.
         */
        toNamedEntityString(wordIndex) {
            let sentenceString = "";
            let word = this.getWord(wordIndex);
            let startIndex = wordIndex - 1;
            while (startIndex >= 0 && this.words[startIndex].getNamedEntityType() != undefined &&
                this.words[startIndex].getNamedEntityType() == word.getNamedEntityType()) {
                startIndex--;
            }
            startIndex++;
            let endIndex = wordIndex + 1;
            while (endIndex < this.words.length && this.words[endIndex].getNamedEntityType() != undefined &&
                this.words[endIndex].getNamedEntityType() == word.getNamedEntityType()) {
                endIndex++;
            }
            endIndex--;
            for (let k = 0; k < this.words.length; k++) {
                if (k >= startIndex && k <= endIndex) {
                    sentenceString += " <b><font color=\"blue\">" + this.words[k].getName() + "</font></b>";
                }
                else {
                    sentenceString += " " + this.words[k].getName();
                }
            }
            return sentenceString;
        }
        /**
         * Compares the sentence with the given sentence and returns a parser evaluation score for this comparison. The result
         * is calculated by summing up the parser evaluation scores of word by word dpendency relation comparisons.
         * @param sentence Sentence to be compared.
         * @return A parser evaluation score object.
         */
        compareParses(sentence) {
            let score = new ParserEvaluationScore_1.ParserEvaluationScore();
            for (let i = 0; i < this.wordCount(); i++) {
                let relation1 = this.words[i].getUniversalDependency();
                let relation2 = sentence.getWord(i).getUniversalDependency();
                if (relation1 != undefined && relation2 != undefined) {
                    score.add(relation1.compareRelations(relation2));
                }
            }
            return score;
        }
        static addAll(result, toBeAdded) {
            for (let literal of toBeAdded) {
                result.push(literal);
            }
        }
        addAll(result, toBeAdded) {
            for (let synSet of toBeAdded) {
                result.push(synSet);
            }
        }
        /**
         * Returns the connlu format of the sentence with appended prefix string based on the path.
         * @param path Path of the sentence.
         * @return The connlu format of the sentence with appended prefix string based on the path.
         */
        getUniversalDependencyFormat(path) {
            let result;
            if (path != undefined) {
                result = "# sent_id = " + path + this.getFileName() + "\n" + "# text = " + this.toWords() + "\n";
            }
            else {
                result = "# sent_id = " + this.getFileName() + "\n" + "# text = " + this.toWords() + "\n";
            }
            for (let i = 0; i < this.wordCount(); i++) {
                let word = this.getWord(i);
                result += (i + 1) + "\t" + word.getUniversalDependencyFormat(this.wordCount()) + "\n";
            }
            result += "\n";
            return result;
        }
        /**
         * Creates a list of literal candidates for the i'th word in the sentence. It combines the results of
         * 1. All possible root forms of the i'th word in the sentence
         * 2. All possible 2-word expressions containing the i'th word in the sentence
         * 3. All possible 3-word expressions containing the i'th word in the sentence
         * @param wordNet Turkish wordnet
         * @param fsm Turkish morphological analyzer
         * @param wordIndex Word index
         * @return List of literal candidates containing all possible root forms and multiword expressions.
         */
        constructLiterals(wordNet, fsm, wordIndex) {
            let word = this.getWord(wordIndex);
            let possibleLiterals = new Array();
            let morphologicalParse = word.getParse();
            let metamorphicParse = word.getMetamorphicParse();
            AnnotatedSentence.addAll(possibleLiterals, wordNet.constructLiterals(morphologicalParse.getWord().getName(), morphologicalParse, metamorphicParse, fsm));
            let firstSucceedingWord = undefined;
            let secondSucceedingWord = undefined;
            if (this.wordCount() > wordIndex + 1) {
                firstSucceedingWord = this.getWord(wordIndex + 1);
                if (this.wordCount() > wordIndex + 2) {
                    secondSucceedingWord = this.getWord(wordIndex + 2);
                }
            }
            if (firstSucceedingWord != null) {
                if (secondSucceedingWord != null) {
                    AnnotatedSentence.addAll(possibleLiterals, wordNet.constructIdiomLiterals(fsm, word.getParse(), word.getMetamorphicParse(), firstSucceedingWord.getParse(), firstSucceedingWord.getMetamorphicParse(), secondSucceedingWord.getParse(), secondSucceedingWord.getMetamorphicParse()));
                }
                AnnotatedSentence.addAll(possibleLiterals, wordNet.constructIdiomLiterals(fsm, word.getParse(), word.getMetamorphicParse(), firstSucceedingWord.getParse(), firstSucceedingWord.getMetamorphicParse()));
            }
            return possibleLiterals;
        }
        /**
         * Creates a list of synset candidates for the i'th word in the sentence. It combines the results of
         * 1. All possible synsets containing the i'th word in the sentence
         * 2. All possible synsets containing 2-word expressions, which contains the i'th word in the sentence
         * 3. All possible synsets containing 3-word expressions, which contains the i'th word in the sentence
         * @param wordNet Turkish wordnet
         * @param fsm Turkish morphological analyzer
         * @param wordIndex Word index
         * @return List of synset candidates containing all possible root forms and multiword expressions.
         */
        constructSynSets(wordNet, fsm, wordIndex) {
            let word = this.getWord(wordIndex);
            let possibleSynSets = new Array();
            let morphologicalParse = word.getParse();
            let metamorphicParse = word.getMetamorphicParse();
            let toBeAdded = wordNet.constructSynSets(morphologicalParse.getWord().getName(), morphologicalParse, metamorphicParse, fsm);
            this.addAll(possibleSynSets, toBeAdded);
            let firstPrecedingWord = undefined;
            let secondPrecedingWord = undefined;
            let firstSucceedingWord = undefined;
            let secondSucceedingWord = undefined;
            if (wordIndex > 0) {
                firstPrecedingWord = this.getWord(wordIndex - 1);
                if (wordIndex > 1) {
                    secondPrecedingWord = this.getWord(wordIndex - 2);
                }
            }
            if (this.wordCount() > wordIndex + 1) {
                firstSucceedingWord = this.getWord(wordIndex + 1);
                if (this.wordCount() > wordIndex + 2) {
                    secondSucceedingWord = this.getWord(wordIndex + 2);
                }
            }
            if (firstPrecedingWord != undefined) {
                if (secondPrecedingWord != undefined) {
                    toBeAdded = wordNet.constructIdiomSynSets(fsm, secondPrecedingWord.getParse(), secondPrecedingWord.getMetamorphicParse(), firstPrecedingWord.getParse(), firstPrecedingWord.getMetamorphicParse(), word.getParse(), word.getMetamorphicParse());
                    this.addAll(possibleSynSets, toBeAdded);
                }
                toBeAdded = wordNet.constructIdiomSynSets(fsm, firstPrecedingWord.getParse(), firstPrecedingWord.getMetamorphicParse(), word.getParse(), word.getMetamorphicParse());
                this.addAll(possibleSynSets, toBeAdded);
            }
            if (firstPrecedingWord != undefined && firstSucceedingWord != undefined) {
                toBeAdded = wordNet.constructIdiomSynSets(fsm, firstPrecedingWord.getParse(), firstPrecedingWord.getMetamorphicParse(), word.getParse(), word.getMetamorphicParse(), firstSucceedingWord.getParse(), firstSucceedingWord.getMetamorphicParse());
                this.addAll(possibleSynSets, toBeAdded);
            }
            if (firstSucceedingWord != undefined) {
                if (secondSucceedingWord != undefined) {
                    toBeAdded = wordNet.constructIdiomSynSets(fsm, word.getParse(), word.getMetamorphicParse(), firstSucceedingWord.getParse(), firstSucceedingWord.getMetamorphicParse(), secondSucceedingWord.getParse(), secondSucceedingWord.getMetamorphicParse());
                    this.addAll(possibleSynSets, toBeAdded);
                }
                toBeAdded = wordNet.constructIdiomSynSets(fsm, word.getParse(), word.getMetamorphicParse(), firstSucceedingWord.getParse(), firstSucceedingWord.getMetamorphicParse());
                this.addAll(possibleSynSets, toBeAdded);
            }
            return possibleSynSets;
        }
    }
    exports.AnnotatedSentence = AnnotatedSentence;
});
//# sourceMappingURL=AnnotatedSentence.js.map