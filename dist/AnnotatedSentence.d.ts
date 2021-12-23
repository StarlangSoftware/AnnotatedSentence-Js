import { Sentence } from "nlptoolkit-corpus/dist/Sentence";
import { AnnotatedWord } from "./AnnotatedWord";
import { AnnotatedPhrase } from "./AnnotatedPhrase";
import { FramesetList } from "nlptoolkit-propbank/dist/FramesetList";
import { FrameNet } from "nlptoolkit-framenet/dist/FrameNet";
import { ParserEvaluationScore } from "nlptoolkit-dependencyparser/dist/ParserEvaluationScore";
import { WordNet } from "nlptoolkit-wordnet/dist/WordNet";
import { FsmMorphologicalAnalyzer } from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/FsmMorphologicalAnalyzer";
import { Literal } from "nlptoolkit-wordnet/dist/Literal";
import { SynSet } from "nlptoolkit-wordnet/dist/SynSet";
export declare class AnnotatedSentence extends Sentence {
    private file;
    /**
     * Reads an annotated sentence from a text file.
     * @param fileName File containing the annotated sentence.
     */
    constructor(fileName: string);
    /**
     * Returns file name of the sentence
     * @return File name of the sentence
     */
    getFileName(): string;
    /**
     * The method constructs all possible shallow parse groups of a sentence.
     * @return Shallow parse groups of a sentence.
     */
    getShallowParseGroups(): Array<AnnotatedPhrase>;
    /**
     * The method checks all words in the sentence and returns true if at least one of the words is annotated with
     * PREDICATE tag.
     * @return True if at least one of the words is annotated with PREDICATE tag; false otherwise.
     */
    containsPredicate(): boolean;
    /**
     * The method checks all words in the sentence and returns true if at least one of the words is annotated with
     * PREDICATE tag.
     * @return True if at least one of the words is annotated with PREDICATE tag; false otherwise.
     */
    containsFramePredicate(): boolean;
    updateConnectedPredicate(previousId: string, currentId: string): boolean;
    /**
     * The method returns all possible words, which is
     * 1. Verb
     * 2. Its semantic tag is assigned
     * 3. A frameset exists for that semantic tag
     * @param framesetList Frameset list that contains all frames for Turkish
     * @return An array of words, which are verbs, semantic tags assigned, and framesetlist assigned for that tag.
     */
    predicateCandidates(framesetList: FramesetList): Array<AnnotatedWord>;
    /**
     * The method returns all possible words, which is
     * 1. Verb
     * 2. Its semantic tag is assigned
     * 3. A frameset exists for that semantic tag
     * @param frameNet FrameNet list that contains all frames for Turkish
     * @return An array of words, which are verbs, semantic tags assigned, and framenet assigned for that tag.
     */
    predicateFrameCandidates(frameNet: FrameNet): Array<AnnotatedWord>;
    /**
     * Returns the i'th predicate in the sentence.
     * @param index Predicate index
     * @return The predicate with index index in the sentence.
     */
    getPredicate(index: number): string;
    /**
     * Removes the i'th word from the sentence
     * @param index Word index
     */
    removeWord(index: number): void;
    /**
     * The toStems method returns an accumulated string of each word's stems in words {@link Array}.
     * If the parse of the word does not exist, the method adds the surfaceform to the resulting string.
     *
     * @return String result which has all the stems of each item in words {@link Array}.
     */
    toStems(): string;
    /**
     * Creates a html string for the annotated sentence, where the dependency relation of the word with the give
     * wordIndex is specified with color codes. The parameter word is drawn in red color, the dependent word is
     * drawn in blue color.
     * @param wordIndex The word for which the dependency relation will be displayed.
     * @return Html string.
     */
    toDependencyString(wordIndex: number): string;
    /**
     * Creates a shallow parse string for the annotated sentence, where the shallow parse of the word with the give
     * wordIndex and the surrounding words with the same shallow parse tag are specified with blue color.
     * @param wordIndex The word for which the shallow parse tag will be displayed.
     * @return Html string.
     */
    toShallowParseString(wordIndex: number): string;
    /**
     * Creates a html string for the annotated sentence, where the named entity of the word with the give
     * wordIndex and the surrounding words with the same named entity tag are specified with blue color.
     * @param wordIndex The word for which the named entity tag will be displayed.
     * @return Html string.
     */
    toNamedEntityString(wordIndex: number): string;
    compareParses(sentence: AnnotatedSentence): ParserEvaluationScore;
    private static addAll;
    private addAll;
    getUniversalDependencyFormat(path?: string): string;
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
    constructLiterals(wordNet: WordNet, fsm: FsmMorphologicalAnalyzer, wordIndex: number): Array<Literal>;
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
    constructSynSets(wordNet: WordNet, fsm: FsmMorphologicalAnalyzer, wordIndex: number): Array<SynSet>;
}
