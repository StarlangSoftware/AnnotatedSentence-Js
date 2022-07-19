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
[C++](https://github.com/starlangsoftware/AnnotatedSentence-CPP), [Swift](https://github.com/starlangsoftware/AnnotatedSentence-Swift), 
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
