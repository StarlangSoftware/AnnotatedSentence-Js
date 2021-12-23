import { Word } from "nlptoolkit-dictionary/dist/Dictionary/Word";
import { MorphologicalParse } from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/MorphologicalParse";
import { MetamorphicParse } from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/MetamorphicParse";
import { NamedEntityType } from "nlptoolkit-namedentityrecognition/dist/NamedEntityType";
import { Argument } from "nlptoolkit-propbank/dist/Argument";
import { FrameElement } from "nlptoolkit-framenet/dist/FrameElement";
import { UniversalDependencyRelation } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation";
import { PolarityType } from "nlptoolkit-sentinet/dist/PolarityType";
import { Slot } from "nlptoolkit-namedentityrecognition/dist/Slot";
import { Language } from "./Language";
import { ViewLayerType } from "./ViewLayerType";
import { Gazetteer } from "nlptoolkit-namedentityrecognition/dist/Gazetteer";
export declare class AnnotatedWord extends Word {
    /**
     * In order to add another layer, do the following:
     * 1. Select a name for the layer.
     * 2. Add a new constant to ViewLayerType.
     * 3. Add private attribute.
     * 4. Add an if-else to the constructor, where you set the private attribute with the layer name.
     * 5. Update toString method.
     * 6. Add initial value to the private attribute in other constructors.
     * 7. Update getLayerInfo.
     * 8. Add getter and setter methods.
     */
    private parse;
    private metamorphicParse;
    private semantic;
    private namedEntityType;
    private argument;
    private frameElement;
    private universalDependency;
    private shallowParse;
    private polarity;
    private slot;
    private ccg;
    private posTag;
    private language;
    constructor(word: string, second?: any);
    /**
     * Converts an {@link AnnotatedWord} to string. For each annotation layer, the method puts a left brace, layer name,
     * equal sign and layer value finishing with right brace.
     * @return String form of the {@link AnnotatedWord}.
     */
    toString(): string;
    /**
     * Returns the value of a given layer.
     * @param viewLayerType Layer for which the value questioned.
     * @return The value of the given layer.
     */
    getLayerInfo(viewLayerType: ViewLayerType): string;
    /**
     * Returns the morphological parse layer of the word.
     * @return The morphological parse of the word.
     */
    getParse(): MorphologicalParse;
    /**
     * Sets the morphological parse layer of the word.
     * @param parseString The new morphological parse of the word in string form.
     */
    setParse(parseString?: string): void;
    /**
     * Returns the metamorphic parse layer of the word.
     * @return The metamorphic parse of the word.
     */
    getMetamorphicParse(): MetamorphicParse;
    /**
     * Sets the metamorphic parse layer of the word.
     * @param parseString The new metamorphic parse of the word in string form.
     */
    setMetamorphicParse(parseString: string): void;
    /**
     * Returns the semantic layer of the word.
     * @return Sense id of the word.
     */
    getSemantic(): string;
    /**
     * Sets the semantic layer of the word.
     * @param semantic New sense id of the word.
     */
    setSemantic(semantic: string): void;
    /**
     * Returns the named entity layer of the word.
     * @return Named entity tag of the word.
     */
    getNamedEntityType(): NamedEntityType;
    /**
     * Sets the named entity layer of the word.
     * @param namedEntity New named entity tag of the word.
     */
    setNamedEntityType(namedEntity?: string): void;
    /**
     * Returns the semantic role layer of the word.
     * @return Semantic role tag of the word.
     */
    getArgument(): Argument;
    /**
     * Sets the semantic role layer of the word.
     * @param argument New semantic role tag of the word.
     */
    setArgument(argument?: string): void;
    /**
     * Returns the frameNet layer of the word.
     * @return FrameNet tag of the word.
     */
    getFrameElement(): FrameElement;
    /**
     * Sets the framenet layer of the word.
     * @param frameElement New frame element tag of the word.
     */
    setFrameElement(frameElement?: string): void;
    /**
     * Returns the slot filling layer of the word.
     * @return Slot tag of the word.
     */
    getSlot(): Slot;
    /**
     * Sets the slot filling layer of the word.
     * @param slot New slot tag of the word.
     */
    setSlot(slot?: string): void;
    /**
     * Returns the polarity layer of the word.
     * @return Polarity tag of the word.
     */
    getPolarity(): PolarityType;
    /**
     * Returns the polarity layer of the word.
     * @return Polarity string of the word.
     */
    getPolarityString(): string;
    /**
     * Sets the polarity layer of the word.
     * @param polarity New polarity tag of the word.
     */
    setPolarity(polarity?: string): void;
    /**
     * Returns the shallow parse layer of the word.
     * @return Shallow parse tag of the word.
     */
    getShallowParse(): string;
    /**
     * Sets the shallow parse layer of the word.
     * @param parse New shallow parse tag of the word.
     */
    setShallowParse(parse: string): void;
    /**
     * Returns the universal dependency layer of the word.
     * @return Universal dependency relation of the word.
     */
    getUniversalDependency(): UniversalDependencyRelation;
    /**
     * Sets the universal dependency layer of the word.
     * @param to Word related to.
     * @param dependencyType type of dependency the word is related to.
     */
    setUniversalDependency(to: number, dependencyType: string): void;
    /**
     * Returns the universal pos of the word.
     * @return If the language is Turkish, it directly calls getUniversalDependencyPos of the parse. If the language
     * is English, it returns pos according to the Penn tag of the current word.
     */
    getUniversalDependencyPos(): string;
    /**
     * Returns the features of the universal dependency relation of the current word.
     * @return If the language is Turkish, it calls getUniversalDependencyFeatures of the parse. If the language is
     * English, it returns dependency features according to the Penn tag of the current word.
     */
    getUniversalDependencyFeatures(): Array<string>;
    getUniversalDependencyFormat(sentenceLength: number): string;
    /**
     * Returns the CCG layer of the word.
     * @return CCG string of the word.
     */
    getCcg(): string;
    /**
     * Sets the CCG layer of the word.
     * @param ccg New CCG of the word.
     */
    setCcg(ccg: string): void;
    /**
     * Returns the posTag layer of the word.
     * @return posTag string of the word.
     */
    getPosTag(): string;
    /**
     * Sets the posTag layer of the word.
     * @param posTag New posTag of the word.
     */
    setPosTag(posTag: string): void;
    checkGazetteer(gazetteer: Gazetteer): void;
    /**
     * Converts a language string to language.
     * @param languageString String defining the language name.
     * @return Language corresponding to the languageString.
     */
    private getLanguageFromString;
    /**
     * Returns the language of the word.
     * @return The language of the word.
     */
    getLanguage(): Language;
}
