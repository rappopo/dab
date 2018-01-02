# Changelog

## 0.1.1

* Making aliases for createCollection() & removeCollection()
* Remove nullable in collection in favor of required
* Change collectionSrc & collectionDest in copyFrom/To to srcCollection & destCollection respectively

## 0.1.0

* Change the term namespace to collection
* Remove collection auto detection because of its unreliability
* Fix problem on copyFrom/copyTo if collection is different from the default one
* Introduce collection management: createCollection(), renameCollection(), removeCollection()

## 0.0.12

* Introduce namespace (ns) options

## 0.0.11

* Making schema as built-in feature because @rappopo/bdez will be refactored as a fullblown ORM/ODM  

## 0.0.10

* Supporting schema through @rappopo/bdez