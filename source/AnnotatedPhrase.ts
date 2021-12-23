import {Sentence} from "nlptoolkit-corpus/dist/Sentence";

export class AnnotatedPhrase extends Sentence{

    private readonly wordIndex: number
    private readonly tag: string

    /**
     * Constructor for AnnotatedPhrase. AnnotatedPhrase stores information about phrases such as
     * Shallow Parse phrases or named entity phrases.
     * @param wordIndex Starting index of the first word in the phrase w.r.t. original sentence the phrase occurs.
     * @param tag Tag of the phrase. Corresponds to the shallow parse or named entity tag.
     */
    constructor(wordIndex: number, tag: string) {
        super();
        this.wordIndex = wordIndex
        this.tag = tag
    }

    /**
     * Accessor for the wordIndex attribute.
     * @return Starting index of the first word in the phrase w.r.t. original sentence the phrase occurs.
     */
    getWordIndex(): number{
        return this.wordIndex
    }

    /**
     * Accessor for the tag attribute.
     * @return Tag of the phrase. Corresponds to the shallow parse or named entity tag.
     */
    getTag(): string{
        return this.tag
    }
}