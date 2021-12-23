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

For Developers
============

You can also see [Python](https://github.com/starlangsoftware/AnnotatedSentence-Py), [Cython](https://github.com/starlangsoftware/AnnotatedSentence-Cy), [Java](https://github.com/starlangsoftware/AnnotatedSentence), 
[C++](https://github.com/starlangsoftware/AnnotatedSentence-CPP), [Swift](https://github.com/starlangsoftware/AnnotatedSentence-Swift), 
or [C#](https://github.com/starlangsoftware/AnnotatedSentence-CS) repository.

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
