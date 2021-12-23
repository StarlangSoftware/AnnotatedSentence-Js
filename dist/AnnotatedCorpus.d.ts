import { Corpus } from "nlptoolkit-corpus/dist/Corpus";
import { ParserEvaluationScore } from "nlptoolkit-dependencyparser/dist/ParserEvaluationScore";
export declare class AnnotatedCorpus extends Corpus {
    /**
     * A constructor of {@link AnnotatedCorpus} class which reads all {@link AnnotatedSentence} files with the file
     * name satisfying the given pattern inside the given folder. For each file inside that folder, the constructor
     * creates an AnnotatedSentence and puts in inside the list parseTrees.
     * @param folder Folder where all sentences reside.
     * @param pattern File pattern such as "." ".train" ".test".
     */
    constructor(folder?: string, pattern?: string);
    compareParses(corpus: AnnotatedCorpus): ParserEvaluationScore;
}
