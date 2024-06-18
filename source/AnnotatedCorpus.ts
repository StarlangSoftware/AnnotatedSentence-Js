import {Corpus} from "nlptoolkit-corpus/dist/Corpus";
import * as fs from "fs";
import {AnnotatedSentence} from "./AnnotatedSentence";
import {ParserEvaluationScore} from "nlptoolkit-dependencyparser/dist/ParserEvaluationScore";

export class AnnotatedCorpus extends Corpus{

    /**
     * A constructor of {@link AnnotatedCorpus} class which reads all {@link AnnotatedSentence} files with the file
     * name satisfying the given pattern inside the given folder. For each file inside that folder, the constructor
     * creates an AnnotatedSentence and puts in inside the list parseTrees.
     * @param folder Folder where all sentences reside.
     * @param pattern File pattern such as "." ".train" ".test".
     */
    constructor(folder?: string, pattern?: string) {
        super()
        let files = fs.readdirSync(folder);
        files.sort()
        for (let file of files){
            if (pattern != undefined){
                if (!file.includes(pattern)){
                    continue
                }
            }
            let sentence = new AnnotatedSentence(folder + "/" + file)
            this.sentences.push(sentence)
        }
    }

    /**
     * Compares the corpus with the given corpus and returns a parser evaluation score for this comparison. The result
     * is calculated by summing up the parser evaluation scores of sentence by sentence dependency relation comparisons.
     * @param corpus Corpus to be compared.
     * @return A parser evaluation score object.
     */
    compareParses(corpus: AnnotatedCorpus): ParserEvaluationScore{
        let result = new ParserEvaluationScore();
        for (let i = 0; i < this.sentences.length; i++){
            let sentence1 = <AnnotatedSentence> this.sentences[i];
            let sentence2 = <AnnotatedSentence> corpus.getSentence(i);
            result.add(sentence1.compareParses(sentence2));
        }
        return result;
    }

}