This resource allows for matching of Turkish words or expressions with their corresponding entries within the Turkish dictionary, the Turkish PropBank TRopBank, morphological analysis, named entity recognition, word senses from Turkish WordNet KeNet, shallow parsing, and universal dependency relation.

## Data Format

The structure of a sample annotated word is as follows:

	{turkish=Gelir}
	{morphologicalAnalysis=gelir+NOUN+A3SG+PNON+NOM}
	{metaMorphemes=gelir}
	{semantics=TUR10-0289950}
	{namedEntity=NONE}
	{propbank=ARG0$TUR10-0798130}
	{shallowParse=ÖZNE}
	{universalDependency=10$NSUBJ}

As is self-explanatory, 'turkish' tag shows the original Turkish word; 'morphologicalAnalysis' tag shows the correct morphological parse of that word; 'semantics' tag shows the ID of the correct sense of that word; 'namedEntity' tag shows the named entity tag of that word; 'shallowParse' tag shows the semantic role of that word; 'universalDependency' tag shows the index of the head word and the universal dependency for this word; 'propbank' tag shows the semantic role of that word for the verb synset id (frame id in the frame file) which is also given in that tag.

Video Lectures
============

[<img src="https://github.com/StarlangSoftware/AnnotatedSentence/blob/master/video1.jpg" width="50%">](https://youtu.be/FtoCdIELkG8)[<img src="https://github.com/StarlangSoftware/AnnotatedSentence/blob/master/video2.jpg" width="50%">](https://youtu.be/jHxZ2aMimoQ)

For Developers
============

You can also see [Python](https://github.com/starlangsoftware/AnnotatedSentence-Py), [Cython](https://github.com/starlangsoftware/AnnotatedSentence-Cy), [Java](https://github.com/starlangsoftware/AnnotatedSentence), 
[C++](https://github.com/starlangsoftware/AnnotatedSentence-CPP), [C](https://github.com/starlangsoftware/AnnotatedSentence-C), [Swift](https://github.com/starlangsoftware/AnnotatedSentence-Swift), 
or [C#](https://github.com/starlangsoftware/AnnotatedSentence-CS) repository.

## Requirements

* [Node.js 14 or higher](#Node.js)
* [Git](#git)

### Node.js 

To check if you have a compatible version of Node.js installed, use the following command:

    node -v
    
You can find the latest version of Node.js [here](https://nodejs.org/en/download/).

### Git

Install the [latest version of Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Npm Install

	npm install nlptoolkit-annotatedsentence
	
## Download Code

In order to work on code, create a fork from GitHub page. 
Use Git for cloning the code to your local or below line for Ubuntu:

	git clone <your-fork-git-link>

A directory called util will be created. Or you can use below link for exploring the code:

	git clone https://github.com/starlangsoftware/annotatedsentence-js.git

## Open project with Webstorm IDE

Steps for opening the cloned project:

* Start IDE
* Select **File | Open** from main menu
* Choose `AnnotatedSentence-Js` file
* Select open as project option
* Couple of seconds, dependencies will be downloaded. 

Detailed Description
============

+ [AnnotatedCorpus](#annotatedcorpus)
+ [AnnotatedSentence](#annotatedsentence)
+ [AnnotatedWord](#annotatedword)

## AnnotatedCorpus

To load the annotated corpus:

	AnnotatedCorpus(folder: string, pattern: string)
	let a = AnnotatedCorpus("/Turkish-Phrase", ".train")
	let b = AnnotatedCorpus("/Turkish-Phrase")

To access all the sentences in a AnnotatedCorpus:

	for let i of a.sentenceCount(){
		let annotatedSentence = a.getSentence(i)
	}

## AnnotatedSentence

Bir AnnotatedSentence'daki tüm kelimelere ulaşmak için de

	for let j of annotatedSentence.wordCount(){
		 annotatedWord = annotatedSentence.getWord(j)
	}

## AnnotatedWord

An annotated word is kept in AnnotatedWord class. To access the morphological analysis of 
the annotated word:

	getParse(): MorphologicalParse

Meaning of the annotated word:

	getSemantic(): string

NER annotation of the annotated word:

	getNamedEntityType(): NamedEntityType

Shallow parse tag of the annotated word (e.g., subject, indirect object):

	getShallowParse(): String

Dependency annotation of the annotated word:

	getUniversalDependency(): UniversalDependencyRelation

# Cite

	@INPROCEEDINGS{8374369,
  	author={O. T. {Yıldız} and K. {Ak} and G. {Ercan} and O. {Topsakal} and C. {Asmazoğlu}},
  	booktitle={2018 2nd International Conference on Natural Language and Speech Processing (ICNLSP)}, 
  	title={A multilayer annotated corpus for Turkish}, 
  	year={2018},
  	volume={},
  	number={},
  	pages={1-6},
  	doi={10.1109/ICNLSP.2018.8374369}}

For Contibutors
============

### package.json file

1. main and types are important when this package will be imported.
```
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
```
2. Dependencies should be maximum (not only direct but also indirect references should also be given), everything directly in the code should be given here.
```
  "dependencies": {
    "nlptoolkit-corpus": "^1.0.12",
    "nlptoolkit-dictionary": "^1.0.14",
    "nlptoolkit-morphologicalanalysis": "^1.0.19",
    "nlptoolkit-xmlparser": "^1.0.7"
  }
```

### tsconfig.json file

1. Compiler flags currently includes nodeNext for importing.
```
  "compilerOptions": {
    "outDir": "dist",
    "module": "nodeNext",
    "sourceMap": true,
    "noImplicitAny": true,
    "removeComments": false,
    "declaration": true,
  },
```
2. tests, node_modules and dist should be excluded.
```
  "exclude": [
    "tests",
    "node_modules",
    "dist"
  ]
```

### index.ts file

1. Should include all ts classes.
```
export * from "./CategoryType"
export * from "./InterlingualDependencyType"
export * from "./InterlingualRelation"
export * from "./Literal"
```

### Data files
1. Add data files to the project folder. Subprojects should include all data files of the parent projects.

### Javascript files

1. Classes should be defined as exported.
```
export class JCN extends ICSimilarity{
```
2. Do not forget to comment each function.
```
    /**
     * Computes JCN wordnet similarity metric between two synsets.
     * @param synSet1 First synset
     * @param synSet2 Second synset
     * @return JCN wordnet similarity metric between two synsets
     */
    computeSimilarity(synSet1: SynSet, synSet2: SynSet): number {
```
3. Function names should follow caml case.
```
    setSynSetId(synSetId: string){
```
4. Write getter and setter methods.
```
    getRelation(index: number): Relation{
    setName(name: string){
```
5. Use standard javascript test style.
```
describe('SimilarityPathTest', function() {
    describe('SimilarityPathTest', function() {
        it('testComputeSimilarity', function() {
            let turkish = new WordNet();
            let similarityPath = new SimilarityPath(turkish);
            assert.strictEqual(32.0, similarityPath.computeSimilarity(turkish.getSynSetWithId("TUR10-0656390"), turkish.getSynSetWithId("TUR10-0600460")));
            assert.strictEqual(13.0, similarityPath.computeSimilarity(turkish.getSynSetWithId("TUR10-0412120"), turkish.getSynSetWithId("TUR10-0755370")));
            assert.strictEqual(13.0, similarityPath.computeSimilarity(turkish.getSynSetWithId("TUR10-0195110"), turkish.getSynSetWithId("TUR10-0822980")));
        });
    });
});
```
6. Enumerated types should be declared with enum.
```
export enum CategoryType {
    MATHEMATICS, SPORT, MUSIC, SLANG, BOTANIC,
    PLURAL, MARINE, HISTORY, THEOLOGY, ZOOLOGY,
    METAPHOR, PSYCHOLOGY, ASTRONOMY, GEOGRAPHY, GRAMMAR,
    MILITARY, PHYSICS, PHILOSOPHY, MEDICAL, THEATER,
    ECONOMY, LAW, ANATOMY, GEOMETRY, BUSINESS,
    PEDAGOGY, TECHNOLOGY, LOGIC, LITERATURE, CINEMA,
    TELEVISION, ARCHITECTURE, TECHNICAL, SOCIOLOGY, BIOLOGY,
    CHEMISTRY, GEOLOGY, INFORMATICS, PHYSIOLOGY, METEOROLOGY,
    MINERALOGY
}
```
7. If there are multiple constructors for a class, define them as constructor1, constructor2, ..., then from the original constructor call these methods.
```
    constructor1(symbol: any){
    constructor2(symbol: any, multipleFile: MultipleFile) {
    constructor(symbol: any, multipleFile: MultipleFile = undefined) {
        if (multipleFile == undefined){
            this.constructor1(symbol);
        } else {
            this.constructor2(symbol, multipleFile);
        }
    }
```
8. Importing should be done via import method with referencing the node-modules.
```
import {Corpus} from "nlptoolkit-corpus/dist/Corpus";
import {Sentence} from "nlptoolkit-corpus/dist/Sentence";
```
9. Use xmlparser package for parsing xml files.
```
	var doc = new XmlDocument("test.xml")
	doc.parse()
	let root = doc.getFirstChild()
	let firstChild = root.getFirstChild()
```
