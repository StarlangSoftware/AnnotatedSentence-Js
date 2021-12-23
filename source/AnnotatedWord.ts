import {Word} from "nlptoolkit-dictionary/dist/Dictionary/Word";
import {MorphologicalParse} from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/MorphologicalParse";
import {MetamorphicParse} from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/MetamorphicParse";
import {NamedEntityType} from "nlptoolkit-namedentityrecognition/dist/NamedEntityType";
import {Argument} from "nlptoolkit-propbank/dist/Argument";
import {FrameElement} from "nlptoolkit-framenet/dist/FrameElement";
import {UniversalDependencyRelation} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation";
import {PolarityType} from "nlptoolkit-sentinet/dist/PolarityType";
import {Slot} from "nlptoolkit-namedentityrecognition/dist/Slot";
import {Language} from "./Language";
import {NamedEntityTypeStatic} from "nlptoolkit-namedentityrecognition/dist/NamedEntityTypeStatic";
import {FsmParse} from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/FsmParse";
import {ViewLayerType} from "./ViewLayerType";
import {Gazetteer} from "nlptoolkit-namedentityrecognition/dist/Gazetteer";
import {MorphologicalTag} from "nlptoolkit-morphologicalanalysis/dist/MorphologicalAnalysis/MorphologicalTag";

export class AnnotatedWord extends Word{

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
    private parse: MorphologicalParse = undefined
    private metamorphicParse: MetamorphicParse = undefined
    private semantic: string = undefined
    private namedEntityType: NamedEntityType = undefined
    private argument: Argument = undefined
    private frameElement: FrameElement = undefined
    private universalDependency: UniversalDependencyRelation = undefined
    private shallowParse: string = undefined
    private polarity: PolarityType = undefined
    private slot: Slot = undefined
    private ccg: string = undefined
    private posTag: string = undefined
    private language: Language = Language.TURKISH

    constructor(word: string, second?: any) {
        super("");
        if (second == undefined){
            let splitLayers = word.split(/[{}]/);
            for (let layer of splitLayers){
                if (layer == "")
                    continue;
                if (!layer.includes("=")){
                    this.name = layer;
                    continue;
                }
                let layerType = layer.substring(0, layer.indexOf("="));
                let layerValue = layer.substring(layer.indexOf("=") + 1);
                if (layerType == "turkish" || layerType == "english"
                    || layerType == "persian"){
                    this.name = layerValue;
                    this.language = this.getLanguageFromString(layerType);
                } else {
                    if (layerType == "morphologicalAnalysis"){
                        this.parse = new MorphologicalParse(layerValue);
                    } else {
                        if (layerType == "metaMorphemes"){
                            this.metamorphicParse = new MetamorphicParse(layerValue);
                        } else {
                            if (layerType == "semantics"){
                                this.semantic = layerValue;
                            } else {
                                if (layerType == "namedEntity"){
                                    this.namedEntityType = NamedEntityTypeStatic.getNamedEntityType(layerValue);
                                } else {
                                    if (layerType == "propbank"){
                                        this.argument = new Argument(layerValue);
                                    } else {
                                        if (layerType == "shallowParse"){
                                            this.shallowParse = layerValue;
                                        } else {
                                            if (layerType == "universalDependency"){
                                                let values = layerValue.split("$");
                                                this.universalDependency = new UniversalDependencyRelation(Number.parseInt(values[0]), values[1]);
                                            } else {
                                                if (layerType == "framenet"){
                                                    this.frameElement = new FrameElement(layerValue);
                                                } else {
                                                    if (layerType == "slot"){
                                                        this.slot = new Slot(layerValue);
                                                    } else {
                                                        if (layerType == "polarity"){
                                                            this.setPolarity(layerValue);
                                                        } else {
                                                            if (layerType == "ccg") {
                                                                this.ccg = layerValue;
                                                            } else {
                                                                if (layerType == "posTag"){
                                                                    this.posTag = layerValue;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            if (second instanceof MorphologicalParse){
                this.parse = second
                this.namedEntityType = NamedEntityType.NONE;
                this.argument = new Argument("NONE", null);
            } else {
                if (second instanceof  FsmParse){
                    this.parse = second
                    this.setMetamorphicParse(second.getWithList())
                    this.namedEntityType = NamedEntityType.NONE;
                    this.argument = new Argument("NONE", null);
                } else {
                    this.namedEntityType = second
                    this.argument = new Argument("NONE", null);
                }
            }
        }
    }

    /**
     * Converts an {@link AnnotatedWord} to string. For each annotation layer, the method puts a left brace, layer name,
     * equal sign and layer value finishing with right brace.
     * @return String form of the {@link AnnotatedWord}.
     */
    toString(): string{
        let result;
        switch (this.language){
            case Language.TURKISH:
                result = "{turkish=" + name + "}";
                break;
            case Language.ENGLISH:
                result = "{english=" + name + "}";
                break;
            case Language.PERSIAN:
                result = "{persian=" + name + "}";
                break;
        }
        if (this.parse != undefined){
            result = result + "{morphologicalAnalysis=" + this.parse.toString() + "}";
        }
        if (this.metamorphicParse != undefined){
            result = result + "{metaMorphemes=" + this.metamorphicParse.toString() + "}";
        }
        if (this.semantic != undefined){
            result = result + "{semantics=" + this.semantic + "}";
        }
        if (this.namedEntityType != undefined){
            result = result + "{namedEntity=" + NamedEntityTypeStatic.getNamedEntity(this.namedEntityType) + "}";
        }
        if (this.argument != undefined){
            result = result + "{propbank=" + this.argument.toString() + "}";
        }
        if (this.frameElement != undefined){
            result = result + "{framenet=" + this.frameElement.toString() + "}";
        }
        if (this.shallowParse != undefined){
            result = result + "{shallowParse=" + this.shallowParse + "}";
        }
        if (this.universalDependency != undefined){
            result = result + "{universalDependency=" + this.universalDependency.to() + "$"
                + this.universalDependency.toString() + "}";
        }
        if (this.slot != undefined){
            result = result + "{slot=" + this.slot.toString() + "}";
        }
        if (this.polarity != undefined){
            result = result + "{polarity=" + this.getPolarityString() + "}";
        }
        if (this.ccg != undefined) {
            result = result + "{ccg=" + this.ccg + "}";
        }
        if (this.posTag != undefined) {
            result = result + "{posTag=" + this.posTag + "}";
        }
        return result;
    }

    /**
     * Returns the value of a given layer.
     * @param viewLayerType Layer for which the value questioned.
     * @return The value of the given layer.
     */
    getLayerInfo(viewLayerType: ViewLayerType): string{
        switch (viewLayerType){
            case ViewLayerType.INFLECTIONAL_GROUP:
                if (this.parse != undefined){
                    return this.parse.toString();
                }
                break;
            case ViewLayerType.META_MORPHEME:
                if (this.metamorphicParse != undefined){
                    return this.metamorphicParse.toString();
                }
                break;
            case ViewLayerType.SEMANTICS:
                return this.semantic;
            case ViewLayerType.NER:
                if (this.namedEntityType != undefined){
                    return this.namedEntityType.toString();
                }
                break;
            case ViewLayerType.SHALLOW_PARSE:
                return this.shallowParse;
            case ViewLayerType.TURKISH_WORD:
                return this.name;
            case ViewLayerType.PROPBANK:
                if (this.argument != undefined){
                    return this.argument.toString();
                }
                break;
            case ViewLayerType.DEPENDENCY:
                if (this.universalDependency != undefined){
                    return this.universalDependency.to() + "$" + this.universalDependency.toString();
                }
                break;
            case ViewLayerType.FRAMENET:
                if (frameElement != null){
                    return frameElement.toString();
                }
                break;
            case ViewLayerType.SLOT:
                if (this.slot != undefined){
                    return this.slot.toString();
                }
                break;
            case ViewLayerType.POLARITY:
                if (this.polarity != undefined){
                    return this.getPolarityString();
                }
                break;
            case ViewLayerType.CCG:
                if (this.ccg != undefined) {
                    return this.ccg;
                }
                break;
            case ViewLayerType.POS_TAG:
                if (this.posTag != undefined) {
                    return this.posTag;
                }
                break;
        }
        return undefined;
    }

    /**
     * Returns the morphological parse layer of the word.
     * @return The morphological parse of the word.
     */
    getParse(): MorphologicalParse{
        return this.parse
    }

    /**
     * Sets the morphological parse layer of the word.
     * @param parseString The new morphological parse of the word in string form.
     */
    setParse(parseString?: string){
        if (parseString != undefined){
            this.parse = new MorphologicalParse(parseString);
        } else {
            this.parse = undefined;
        }
    }

    /**
     * Returns the metamorphic parse layer of the word.
     * @return The metamorphic parse of the word.
     */
    getMetamorphicParse(): MetamorphicParse{
        return this.metamorphicParse
    }

    /**
     * Sets the metamorphic parse layer of the word.
     * @param parseString The new metamorphic parse of the word in string form.
     */
    setMetamorphicParse(parseString: string){
        this.metamorphicParse = new MetamorphicParse(parseString);
    }

    /**
     * Returns the semantic layer of the word.
     * @return Sense id of the word.
     */
    getSemantic(): string{
        return this.semantic
    }

    /**
     * Sets the semantic layer of the word.
     * @param semantic New sense id of the word.
     */
    setSemantic(semantic: string){
        this.semantic = semantic
    }

    /**
     * Returns the named entity layer of the word.
     * @return Named entity tag of the word.
     */
    getNamedEntityType(): NamedEntityType{
        return this.namedEntityType
    }

    /**
     * Sets the named entity layer of the word.
     * @param namedEntity New named entity tag of the word.
     */
    setNamedEntityType(namedEntity?: string){
        if (namedEntity != undefined){
            this.namedEntityType = NamedEntityTypeStatic.getNamedEntityType(namedEntity)
        } else {
            this.namedEntityType = undefined
        }
    }

    /**
     * Returns the semantic role layer of the word.
     * @return Semantic role tag of the word.
     */
    getArgument(): Argument{
        return this.argument
    }

    /**
     * Sets the semantic role layer of the word.
     * @param argument New semantic role tag of the word.
     */
    setArgument(argument?: string){
        if (argument != undefined){
            this.argument = new Argument(argument);
        } else {
            this.argument = undefined;
        }
    }

    /**
     * Returns the frameNet layer of the word.
     * @return FrameNet tag of the word.
     */
    getFrameElement(): FrameElement{
        return this.frameElement
    }

    /**
     * Sets the framenet layer of the word.
     * @param frameElement New frame element tag of the word.
     */
    setFrameElement(frameElement?: string){
        if (frameElement != undefined){
            this.frameElement = new FrameElement(frameElement);
        } else {
            this.frameElement = undefined;
        }
    }

    /**
     * Returns the slot filling layer of the word.
     * @return Slot tag of the word.
     */
    getSlot(): Slot{
        return this.slot
    }

    /**
     * Sets the slot filling layer of the word.
     * @param slot New slot tag of the word.
     */
    setSlot(slot?: string){
        if (slot != undefined){
            this.slot = new Slot(slot);
        } else {
            this.slot = undefined;
        }
    }

    /**
     * Returns the polarity layer of the word.
     * @return Polarity tag of the word.
     */
    getPolarity(): PolarityType{
        return this.polarity
    }

    /**
     * Returns the polarity layer of the word.
     * @return Polarity string of the word.
     */
    getPolarityString(): string{
        switch (this.polarity){
            case PolarityType.POSITIVE:
                return "positive";
            case PolarityType.NEGATIVE:
                return "negative";
            case PolarityType.NEUTRAL:
                return "neutral";
            default:
                return "neutral";
        }
    }

    /**
     * Sets the polarity layer of the word.
     * @param polarity New polarity tag of the word.
     */
    setPolarity(polarity?: string){
        if (polarity != undefined){
            switch (polarity.toLowerCase()){
                case "positive":
                case "pos":
                    this.polarity = PolarityType.POSITIVE;
                    break;
                case "negative":
                case "neg":
                    this.polarity = PolarityType.NEGATIVE;
                    break;
                default:
                    this.polarity = PolarityType.NEUTRAL;
            }
        } else {
            this.polarity = undefined;
        }
    }

    /**
     * Returns the shallow parse layer of the word.
     * @return Shallow parse tag of the word.
     */
    getShallowParse(): string{
        return this.shallowParse
    }

    /**
     * Sets the shallow parse layer of the word.
     * @param parse New shallow parse tag of the word.
     */
    setShallowParse(parse: string){
        this.shallowParse = parse
    }

    /**
     * Returns the universal dependency layer of the word.
     * @return Universal dependency relation of the word.
     */
    getUniversalDependency(): UniversalDependencyRelation{
        return this.universalDependency
    }

    /**
     * Sets the universal dependency layer of the word.
     * @param to Word related to.
     * @param dependencyType type of dependency the word is related to.
     */
    setUniversalDependency(to: number, dependencyType: string){
        if (to < 0){
            this.universalDependency = undefined;
        } else {
            this.universalDependency = new UniversalDependencyRelation(to, dependencyType);
        }
    }

    /**
     * Returns the universal pos of the word.
     * @return If the language is Turkish, it directly calls getUniversalDependencyPos of the parse. If the language
     * is English, it returns pos according to the Penn tag of the current word.
     */
    getUniversalDependencyPos(): string{
        if (this.language == Language.TURKISH && this.parse != undefined){
            return this.parse.getUniversalDependencyPos();
        } else {
            if (this.language == Language.ENGLISH && this.posTag != undefined){
                switch (this.posTag){
                    case "#":
                    case "$":
                    case "SYM":
                        return "SYM";
                    case "\"":
                    case ",":
                    case "-LRB-":
                    case "-RRB-":
                    case ".":
                    case ":":
                    case "``":
                    case "HYPH":
                        return "PUNCT";
                    case "AFX":
                    case "JJ":
                    case "JJR":
                    case "JJS":
                        return "ADJ";
                    case "CC":
                        return "CCONJ";
                    case "CD":
                        return "NUM";
                    case "DT":
                    case "PDT":
                    case "PRP$":
                    case "WDT":
                    case "WP$":
                        return "DET";
                    case "IN":
                    case "RP":
                        return "ADP";
                    case "FW":
                    case "LS":
                    case "NIL":
                        return "X";
                    case "VB":
                    case "VBD":
                    case "VBG":
                    case "VBN":
                    case "VBP":
                    case "VBZ":
                        return "VERB";
                    case "MD":
                    case "AUX:VB":
                    case "AUX:VBD":
                    case "AUX:VBG":
                    case "AUX:VBN":
                    case "AUX:VBP":
                    case "AUX:VBZ":
                        return "AUX";
                    case "NN":
                    case "NNS":
                        return "NOUN";
                    case "NNP":
                    case "NNPS":
                        return "PROPN";
                    case "POS":
                    case "TO":
                        return "PART";
                    case "EX":
                    case "PRP":
                    case "WP":
                        return "PRON";
                    case "RB":
                    case "RBR":
                    case "RBS":
                    case "WRB":
                        return "ADV";
                    case "UH":
                        return "INTJ";
                }
            }
        }
        return undefined;
    }

    /**
     * Returns the features of the universal dependency relation of the current word.
     * @return If the language is Turkish, it calls getUniversalDependencyFeatures of the parse. If the language is
     * English, it returns dependency features according to the Penn tag of the current word.
     */
    getUniversalDependencyFeatures(): Array<string>{
        let featureList = new Array<string>();
        if (this.language == Language.TURKISH && this.parse != undefined){
            return this.parse.getUniversalDependencyFeatures(this.parse.getUniversalDependencyPos());
        } else {
            if (this.language == Language.ENGLISH && this.posTag != undefined) {
                switch (this.posTag){
                    case "\"":
                        featureList.push("PunctSide=Fin");
                        featureList.push("PunctType=Quot");
                        break;
                    case ",":
                        featureList.push("PunctType=Comm");
                        break;
                    case "-LRB-":
                        featureList.push("PunctSide=Ini");
                        featureList.push("PunctType=Brck");
                        break;
                    case "-RRB-":
                        featureList.push("PunctSide=Fin");
                        featureList.push("PunctType=Brck");
                        break;
                    case ".":
                        featureList.push("PunctType=Peri");
                        break;
                    case "``":
                        featureList.push("PunctSide=Ini");
                        featureList.push("PunctType=Quot");
                        break;
                    case "HYPH":
                        featureList.push("PunctType=Dash");
                        break;
                    case "AFX":
                        featureList.push("Hyph=Yes");
                        break;
                    case "JJ":
                    case "RB":
                        featureList.push("Degree=Pos");
                        break;
                    case "JJR":
                    case "RBR":
                        featureList.push("Degree=Cmp");
                        break;
                    case "JJS":
                    case "RBS":
                        featureList.push("Degree=Sup");
                        break;
                    case "CD":
                        featureList.push("NumType=Card");
                        break;
                    case "DT":
                        featureList.push("PronType=Art");
                        break;
                    case "PDT":
                        featureList.push("AdjType=Pdt");
                        break;
                    case "PRP$":
                        featureList.push("Poss=Yes");
                        featureList.push("PronType=Prs");
                        break;
                    case "WDT":
                    case "WP":
                    case "WRB":
                        featureList.push("PronType=Int,Rel");
                        break;
                    case "WP$":
                        featureList.push("Poss=Yes");
                        featureList.push("PronType=Int,Rel");
                        break;
                    case "RP":
                        break;
                    case "FW":
                        featureList.push("Foreign=Yes");
                        break;
                    case "LS":
                        featureList.push("NumType=Ord");
                        break;
                    case "MD":
                        break;
                    case "VB":
                    case "AUX:VB":
                        featureList.push("VerbForm=Inf");
                        break;
                    case "VBD":
                    case "AUX:VBD":
                        featureList.push("Mood=Ind");
                        featureList.push("Tense=Past");
                        featureList.push("VerbForm=Fin");
                        break;
                    case "VBG":
                    case "AUX:VBG":
                        featureList.push("Tense=Pres");
                        featureList.push("VerbForm=Part");
                        break;
                    case "VBN":
                    case "AUX:VBN":
                        featureList.push("Tense=Past");
                        featureList.push("VerbForm=Part");
                        break;
                    case "VBP":
                    case "AUX:VBP":
                        featureList.push("Mood=Ind");
                        featureList.push("Tense=Pres");
                        featureList.push("VerbForm=Fin");
                        break;
                    case "VBZ":
                    case "AUX:VBZ":
                        featureList.push("Mood=Ind");
                        featureList.push("Number=Sing");
                        featureList.push("Person=3");
                        featureList.push("Tense=Pres");
                        featureList.push("VerbForm=Fin");
                        break;
                    case "NN":
                    case "NNP":
                        featureList.push("Number=Sing");
                        break;
                    case "NNS":
                    case "NNPS":
                        featureList.push("Number=Plur");
                        break;
                    case "POS":
                        break;
                    case "TO":
                        break;
                    case "EX":
                        featureList.push("PronType=Dem");
                        break;
                    case "PRP":
                        featureList.push("PronType=Prs");
                        break;
                }
            }
        }
        return featureList;
    }

    getUniversalDependencyFormat(sentenceLength: number): string{
        let uPos = this.getUniversalDependencyPos();
        let result
        if (uPos != undefined){
            switch (this.language){
                case Language.TURKISH:
                default:
                    result = this.name + "\t" + this.parse.getWord().getName() + "\t" + uPos + "\t_\t";
                    break;
                case Language.ENGLISH:
                    if (this.metamorphicParse != undefined){
                        result = this.name + "\t" + this.metamorphicParse.getWord().getName() + "\t" + uPos + "\t_\t";
                    } else {
                        result = this.name + "\t" + this.name + "\t" + uPos + "\t_\t";
                    }
                    break;
            }
            let features = this.getUniversalDependencyFeatures();
            if (features.length == 0){
                result = result + "_";
            } else {
                let first = true;
                for (let feature of features){
                    if (first){
                        first = false;
                    } else {
                        result += "|";
                    }
                    result += feature;
                }
            }
            result += "\t";
            if (this.universalDependency != null && this.universalDependency.to() <= sentenceLength){
                result += this.universalDependency.to() + "\t" + this.universalDependency.toString().toLowerCase() + "\t";
            } else {
                result += "_\t_\t";
            }
            result += "_\t_";
            return result;
        } else {
            return this.name + "\t" + this.name + "\t_\t_\t_\t_\t_\t_\t_";
        }
    }

    /**
     * Returns the CCG layer of the word.
     * @return CCG string of the word.
     */
    getCcg(): string{
        return this.ccg
    }

    /**
     * Sets the CCG layer of the word.
     * @param ccg New CCG of the word.
     */
    setCcg(ccg: string){
        this.ccg = ccg
    }

    /**
     * Returns the posTag layer of the word.
     * @return posTag string of the word.
     */
    getPosTag(): string{
        return this.posTag
    }

    /**
     * Sets the posTag layer of the word.
     * @param posTag New posTag of the word.
     */
    setPosTag(posTag: string){
        this.posTag = posTag
    }

    checkGazetteer(gazetteer: Gazetteer){
        let wordLowercase = this.name.toLocaleLowerCase("tr");
        if (gazetteer.contains(wordLowercase) && this.parse.containsTag(MorphologicalTag.PROPERNOUN)){
            this.setNamedEntityType(gazetteer.getName());
        }
        if (wordLowercase.includes("'") && gazetteer.contains(wordLowercase.substring(0, wordLowercase.indexOf("'"))) &&
            this.parse.containsTag(MorphologicalTag.PROPERNOUN)){
            this.setNamedEntityType(gazetteer.getName());
        }
    }

    /**
     * Converts a language string to language.
     * @param languageString String defining the language name.
     * @return Language corresponding to the languageString.
     */
    private getLanguageFromString(languageString: string): Language{
        switch (languageString){
            case "turkish":
            case "Turkish":
                return Language.TURKISH;
            case "english":
            case "English":
                return Language.ENGLISH;
            case "persian":
            case "Persian":
                return Language.PERSIAN;
        }
        return Language.TURKISH;
    }

    /**
     * Returns the language of the word.
     * @return The language of the word.
     */
    getLanguage(): Language{
        return this.language
    }
}