import {Sentence} from "nlptoolkit-corpus/dist/Sentence";
import * as fs from "fs";
import {AnnotatedWord} from "./AnnotatedWord";
import {AnnotatedPhrase} from "./AnnotatedPhrase";
import {FramesetList} from "nlptoolkit-propbank/dist/FramesetList";
import {FrameNet} from "nlptoolkit-framenet/dist/FrameNet";
import {MorphologicalParse} from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/MorphologicalParse";
import {ParserEvaluationScore} from "nlptoolkit-dependencyparser/dist/ParserEvaluationScore";
import {WordNet} from "nlptoolkit-wordnet/dist/WordNet";
import {
    FsmMorphologicalAnalyzer
} from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/FsmMorphologicalAnalyzer";
import {Literal} from "nlptoolkit-wordnet/dist/Literal";
import {SynSet} from "nlptoolkit-wordnet/dist/SynSet";

export class AnnotatedSentence extends Sentence {

    private file: string

    /**
     * Reads an annotated sentence from a text file.
     * Converts a simple sentence to an annotated sentence.
     * @param param File containing the annotated sentence. OR Simple sentence.
     */
    constructor(param?: string) {
        super();
        this.words = []
        if (param !== undefined) {
            if (param.includes(".txt")) {
                let fileName: string = param
                if (fileName !== undefined) {
                    this.file = fileName;
                    let data: string = fs.readFileSync(fileName, 'utf8');
                    let wordList: string[] = data.split("\n")[0].split(" ");
                    for (let word of wordList) {
                        this.words.push(new AnnotatedWord(word));
                    }
                }
            } else {
                let wordList: string[] = param.split(" ");
                for (let word of wordList) {
                    if (word !== "") {
                        this.words.push(new AnnotatedWord(word));
                    }
                }
            }
        }
    }

    /**
     * Returns file name of the sentence
     * @return File name of the sentence
     */
    getFileName(): string {
        return this.file
    }

    /**
     * The method constructs all possible shallow parse groups of a sentence.
     * @return Shallow parse groups of a sentence.
     */
    getShallowParseGroups(): Array<AnnotatedPhrase> {
        let shallowParseGroups = new Array<AnnotatedPhrase>();
        let previousWord = undefined;
        let current = undefined;
        for (let i = 0; i < this.wordCount(); i++) {
            let annotatedWord = <AnnotatedWord>this.getWord(i);
            if (previousWord == null) {
                current = new AnnotatedPhrase(i, annotatedWord.getShallowParse());
            } else {
                if (previousWord.getShallowParse() != null && previousWord.getShallowParse() != annotatedWord.getShallowParse()) {
                    shallowParseGroups.push(current);
                    current = new AnnotatedPhrase(i, annotatedWord.getShallowParse());
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
    containsPredicate(): boolean {
        for (let word of this.words) {
            let annotatedWord = <AnnotatedWord>word;
            if (annotatedWord.getArgument() != undefined &&
                annotatedWord.getArgument().getArgumentType() == "PREDICATE") {
                return true;
            }
        }
        return false;
    }

    /**
     * The method checks all words in the sentence and returns true if at least one of the words is annotated with
     * PREDICATE tag.
     * @return True if at least one of the words is annotated with PREDICATE tag; false otherwise.
     */
    containsFramePredicate(): boolean {
        for (let word of this.words) {
            let annotatedWord = <AnnotatedWord>word;
            if (annotatedWord.getFrameElement() != undefined &&
                annotatedWord.getFrameElement().getFrameElementType() == "PREDICATE") {
                return true;
            }
        }
        return false;
    }

    updateConnectedPredicate(previousId: string, currentId: string): boolean {
        let modified = false;
        for (let word of this.words) {
            let annotatedWord = <AnnotatedWord>word;
            if (annotatedWord.getArgument() != undefined && annotatedWord.getArgument().getId() != null &&
                annotatedWord.getArgument().getId() == previousId) {
                annotatedWord.setArgument(annotatedWord.getArgument().getArgumentType() + "$" + currentId);
                modified = true;
            }
            if (annotatedWord.getFrameElement() != undefined && annotatedWord.getFrameElement().getId() != null &&
                annotatedWord.getFrameElement().getId() == previousId) {
                annotatedWord.setFrameElement(annotatedWord.getFrameElement().getFrameElementType() + "$" + annotatedWord.getFrameElement().getFrame() + "$" + currentId);
                modified = true;
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
    predicateCandidates(framesetList: FramesetList): Array<AnnotatedWord> {
        let candidateList = new Array<AnnotatedWord>();
        for (let word of this.words) {
            let annotatedWord = <AnnotatedWord>word;
            if (annotatedWord.getParse() != undefined && annotatedWord.getParse().isVerb() &&
                annotatedWord.getSemantic() != undefined && framesetList.frameExists(annotatedWord.getSemantic())) {
                candidateList.push(annotatedWord);
            }
        }
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this.words.length - i - 1; j++) {
                let annotatedWord = <AnnotatedWord>this.words[j];
                let nextAnnotatedWord = <AnnotatedWord>this.words[j + 1];
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
    predicateFrameCandidates(frameNet: FrameNet): Array<AnnotatedWord> {
        let candidateList = new Array<AnnotatedWord>();
        for (let word of this.words) {
            let annotatedWord = <AnnotatedWord>word;
            if (annotatedWord.getParse() != undefined && annotatedWord.getParse().isVerb() &&
                annotatedWord.getSemantic() != undefined && frameNet.lexicalUnitExists(annotatedWord.getSemantic())) {
                candidateList.push(annotatedWord);
            }
        }
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this.words.length - i - 1; j++) {
                let annotatedWord = <AnnotatedWord>this.words[j];
                let nextAnnotatedWord = <AnnotatedWord>this.words[j + 1];
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
    getPredicate(index: number): string {
        let count1 = 0, count2 = 0;
        let data = "";
        let word = new Array<AnnotatedWord>();
        let parse = new Array<MorphologicalParse>();
        if (index < this.wordCount()) {
            for (let i = 0; i < this.wordCount(); i++) {
                word.push(<AnnotatedWord>this.getWord(i));
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
            } else {
                data = word[count2].getName();
            }
        }
        return data;
    }

    /**
     * Removes the i'th word from the sentence
     * @param index Word index
     */
    removeWord(index: number) {
        for (let value of this.words) {
            let word = <AnnotatedWord>value;
            if (word.getUniversalDependency() != undefined) {
                if (word.getUniversalDependency().to() == index + 1) {
                    word.setUniversalDependency(-1, "ROOT");
                } else {
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
    toStems(): string {
        if (this.words.length > 0) {
            let annotatedWord = <AnnotatedWord>this.words[0];
            let result
            if (annotatedWord.getParse() != null) {
                result = annotatedWord.getParse().getWord().getName();
            } else {
                result = annotatedWord.getName();
            }
            for (let i = 1; i < this.words.length; i++) {
                annotatedWord = <AnnotatedWord>this.words[i];
                if (annotatedWord.getParse() != undefined) {
                    result = result + " " + annotatedWord.getParse().getWord().getName();
                } else {
                    result = result + " " + annotatedWord.getName();
                }
            }
            return result;
        } else {
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
    toDependencyString(wordIndex: number): string {
        let sentenceString = "";
        let word = <AnnotatedWord>this.getWord(wordIndex);
        for (let k = 0; k < this.words.length; k++) {
            if (wordIndex == k) {
                sentenceString += " <b><font color=\"red\">" + this.words[k].getName() + "</font></b>";
            } else {
                if (k + 1 == word.getUniversalDependency().to()) {
                    sentenceString += " <b><font color=\"blue\">" + this.words[k].getName() + "</font></b>";
                } else {
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
    toShallowParseString(wordIndex: number): string {
        let sentenceString = "";
        let word = <AnnotatedWord>this.getWord(wordIndex);
        let startIndex = wordIndex - 1;
        while (startIndex >= 0 && (<AnnotatedWord>this.words[startIndex]).getShallowParse() != undefined &&
        (<AnnotatedWord>this.words[startIndex]).getShallowParse() == word.getShallowParse()) {
            startIndex--;
        }
        startIndex++;
        let endIndex = wordIndex + 1;
        while (endIndex < this.words.length && (<AnnotatedWord>this.words[endIndex]).getShallowParse() != undefined &&
        (<AnnotatedWord>this.words[endIndex]).getShallowParse() == word.getShallowParse()) {
            endIndex++;
        }
        endIndex--;
        for (let k = 0; k < this.words.length; k++) {
            if (k >= startIndex && k <= endIndex) {
                sentenceString += " <b><font color=\"blue\">" + this.words[k].getName() + "</font></b>";
            } else {
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
    toNamedEntityString(wordIndex: number): string {
        let sentenceString = "";
        let word = <AnnotatedWord>this.getWord(wordIndex);
        let startIndex = wordIndex - 1;
        while (startIndex >= 0 && (<AnnotatedWord>this.words[startIndex]).getNamedEntityType() != undefined &&
        (<AnnotatedWord>this.words[startIndex]).getNamedEntityType() == word.getNamedEntityType()) {
            startIndex--;
        }
        startIndex++;
        let endIndex = wordIndex + 1;
        while (endIndex < this.words.length && (<AnnotatedWord>this.words[endIndex]).getNamedEntityType() != undefined &&
        (<AnnotatedWord>this.words[endIndex]).getNamedEntityType() == word.getNamedEntityType()) {
            endIndex++;
        }
        endIndex--;
        for (let k = 0; k < this.words.length; k++) {
            if (k >= startIndex && k <= endIndex) {
                sentenceString += " <b><font color=\"blue\">" + this.words[k].getName() + "</font></b>";
            } else {
                sentenceString += " " + this.words[k].getName();
            }
        }
        return sentenceString;
    }

    compareParses(sentence: AnnotatedSentence): ParserEvaluationScore {
        let score = new ParserEvaluationScore();
        for (let i = 0; i < this.wordCount(); i++) {
            let relation1 = (<AnnotatedWord>this.words[i]).getUniversalDependency();
            let relation2 = (<AnnotatedWord>sentence.getWord(i)).getUniversalDependency();
            if (relation1 != undefined && relation2 != undefined) {
                score.add(relation1.compareRelations(relation2));
            }
        }
        return score;
    }

    private static addAll(result: Array<Literal>, toBeAdded: Array<Literal>) {
        for (let literal of toBeAdded) {
            result.push(literal)
        }
    }

    private addAll(result: Array<SynSet>, toBeAdded: Array<SynSet>) {
        for (let synSet of toBeAdded) {
            result.push(synSet)
        }
    }

    getUniversalDependencyFormat(path?: string): string {
        let result
        if (path != undefined) {
            result = "# sent_id = " + path + this.getFileName() + "\n" + "# text = " + this.toWords() + "\n";
        } else {
            result = "# sent_id = " + this.getFileName() + "\n" + "# text = " + this.toWords() + "\n";
        }
        for (let i = 0; i < this.wordCount(); i++) {
            let word = <AnnotatedWord>this.getWord(i);
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
    constructLiterals(wordNet: WordNet, fsm: FsmMorphologicalAnalyzer, wordIndex: number): Array<Literal> {
        let word = <AnnotatedWord>this.getWord(wordIndex);
        let possibleLiterals = new Array<Literal>();
        let morphologicalParse = word.getParse();
        let metamorphicParse = word.getMetamorphicParse();
        AnnotatedSentence.addAll(possibleLiterals, wordNet.constructLiterals(morphologicalParse.getWord().getName(),
            morphologicalParse, metamorphicParse, fsm));
        let firstSucceedingWord = undefined;
        let secondSucceedingWord = undefined;
        if (this.wordCount() > wordIndex + 1) {
            firstSucceedingWord = <AnnotatedWord>this.getWord(wordIndex + 1);
            if (this.wordCount() > wordIndex + 2) {
                secondSucceedingWord = <AnnotatedWord>this.getWord(wordIndex + 2);
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
    constructSynSets(wordNet: WordNet, fsm: FsmMorphologicalAnalyzer, wordIndex: number): Array<SynSet> {
        let word = <AnnotatedWord>this.getWord(wordIndex);
        let possibleSynSets = new Array<SynSet>();
        let morphologicalParse = word.getParse();
        let metamorphicParse = word.getMetamorphicParse();
        let toBeAdded: Array<SynSet> = wordNet.constructSynSets(morphologicalParse.getWord().getName(), morphologicalParse, metamorphicParse, fsm);
        this.addAll(possibleSynSets, toBeAdded);
        let firstPrecedingWord = undefined;
        let secondPrecedingWord = undefined;
        let firstSucceedingWord = undefined;
        let secondSucceedingWord = undefined;
        if (wordIndex > 0) {
            firstPrecedingWord = <AnnotatedWord>this.getWord(wordIndex - 1);
            if (wordIndex > 1) {
                secondPrecedingWord = <AnnotatedWord>this.getWord(wordIndex - 2);
            }
        }
        if (this.wordCount() > wordIndex + 1) {
            firstSucceedingWord = <AnnotatedWord>this.getWord(wordIndex + 1);
            if (this.wordCount() > wordIndex + 2) {
                secondSucceedingWord = <AnnotatedWord>this.getWord(wordIndex + 2);
            }
        }
        if (firstPrecedingWord != undefined) {
            if (secondPrecedingWord != undefined) {
                toBeAdded = wordNet.constructIdiomSynSets(fsm, secondPrecedingWord.getParse(), secondPrecedingWord.getMetamorphicParse(), firstPrecedingWord.getParse(), firstPrecedingWord.getMetamorphicParse(), word.getParse(), word.getMetamorphicParse())
                this.addAll(possibleSynSets, toBeAdded);
            }
            toBeAdded = wordNet.constructIdiomSynSets(fsm, firstPrecedingWord.getParse(), firstPrecedingWord.getMetamorphicParse(), word.getParse(), word.getMetamorphicParse())
            this.addAll(possibleSynSets, toBeAdded);
        }
        if (firstPrecedingWord != undefined && firstSucceedingWord != undefined) {
            toBeAdded = wordNet.constructIdiomSynSets(fsm, firstPrecedingWord.getParse(), firstPrecedingWord.getMetamorphicParse(), word.getParse(), word.getMetamorphicParse(), firstSucceedingWord.getParse(), firstSucceedingWord.getMetamorphicParse())
            this.addAll(possibleSynSets, toBeAdded);
        }
        if (firstSucceedingWord != undefined) {
            if (secondSucceedingWord != undefined) {
                toBeAdded = wordNet.constructIdiomSynSets(fsm, word.getParse(), word.getMetamorphicParse(), firstSucceedingWord.getParse(), firstSucceedingWord.getMetamorphicParse(), secondSucceedingWord.getParse(), secondSucceedingWord.getMetamorphicParse())
                this.addAll(possibleSynSets, toBeAdded);
            }
            toBeAdded = wordNet.constructIdiomSynSets(fsm, word.getParse(), word.getMetamorphicParse(), firstSucceedingWord.getParse(), firstSucceedingWord.getMetamorphicParse())
            this.addAll(possibleSynSets, toBeAdded);
        }
        return possibleSynSets;
    }
}