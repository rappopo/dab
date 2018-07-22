# Changelog

## 0.6.7

* Fix typo, again!

## 0.6.6

* Fix validator.js function name typo isAlphaNumeric to isAlphanumeric
* Upgrade validator.js to version 10.4.*

## 0.6.5

* Rolling back changes in 0.6.4

## 0.6.4

* Adding utility method: isUnique

## 0.6.2

* Include nanoid for auto ID generator

## 0.5.1

* Normalize sort parameter
* Sort accepts: object, array and string
* Full support for validator.js's validator & sanitizer

## 0.5.0

* Collection: added attribIdType
* Collection: added indexes support
* Collection: added object & array support
* Collection: added id column if missing
* Collection: change internal date/time from JsDate to ISO8601
* Sanitization: fix date/time sanitizer

## 0.4.0

* Collection: change fields to attributes
* Collection: change attributes to be an object
* Collection: change attribName to srcAttribName
* Collection: change attribId to srcAttribId
* Change everything related above to match the new specs

## 0.3.0

* Adding attribId to collection. This is to let DAB know which column is the doc ID
* Fix a few small bugs inside collection

## 0.2.3

* Fix validateDoc() if column is null or undefined

## 0.2.2

* Adding ignored columns in validateDoc()

## 0.2.1

* Fix required() validator

## 0.2.0

* Adding data validation through validateDoc()
* Rewrite data sanitization

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