# @kernel-js/storage<br />
[![Build Status](https://travis-ci.org/kernel-js/storage.svg?branch=master)](https://travis-ci.org/kernel-js/storage)
[![Coverage Status](https://coveralls.io/repos/github/kernel-js/storage/badge.svg?branch=master)](https://coveralls.io/github/kernel-js/storage?branch=master)
<br />

> Util functions and classes

* Expose some [Lodash](https://www.npmjs.com/package/lodash) functions
* Exports additional helpers
* Offers a Collection for working with arrays and objects, powered by [collect.js](https://www.npmjs.com/package/collect.js).
All credits to them. I just added some methods to work with `has`, `getStorageItem` and `put` on nested objects (`hasIn`, `getIn` and `putIn`).
* Incredible DateTime powered by [Luxon](https://www.npmjs.com/package/luxon) for working with dates and times.
* WIP - Browser detection and features based fingerprint

## Inspirations

The main inspiration on my work is PHP Laravel Framework which I love because of its simplicity and beauty of code.

## Why

First of all I created this to support development of [Kernel Framework](https://www.npmjs.com/package/@kernel-js/framework).<br />
Just like the rest of the packages that make up the framework, I make the most of other existing libraries that are well 
tested on a day-to-day basis. The idea is not to reinvent the wheel, just join the ideas in a lightweight framework 
(the focus is on the client side), simple to use and make the code on the front more beautiful and organized. 

## Install
```npm install @kernel-js/storage```

## Helpers

### Custom

* [env](#env)
* [collect](#collect)
* [isArray](#isArray)
* [isObject](#isObject)
* [isEmpty](#isEmpty)
* [isNotEmpty](#isNotEmpty)
* [toBoolean](#toBoolean)
* [removeEmpty](#removeEmpty)
* [mapEmptyToNull](#mapEmptyToNull)

## Lodash

* camelCase
* capitalize
* find
* floor
* getStorageItem
* has
* hasIn
* head
* keysIn
* last
* set
* snakeCase
* startCase
* map
* mapValues
* omitBy

<br />
<a name="env" /></a>

### env

Gets the value of an environment variable.

	env(key, [defaultValue])

__Arguments__

* `key` - the path to the property you want. You can use dot notation on nested objects
* `defaultValue` - the optional default value when the key was not found

```js
// Examples
env('NODE_ENV');
env('app.name');
env('app.name', 'My Default App Name');
```

---------------------------------------

<a name="collect" /></a>

### collect

Give you a Collection with the informed data. See [collect.js](https://www.npmjs.com/package/collect.js) docs.

	collect(data)

__Arguments__

* `data` - the object or array to create collection with

```js
// Example
collect([1, 2, 3]);
collect({"a": "a value", "b": "b value"});
```

---------------------------------------

<a name="isArray" /></a>

### isArray

Return a boolean if the informed value is of Array type.

	isArray(value)

__Arguments__

* `value` - any value

```js
// Example
isArray([]); // True
isArray({}); // False
isArray(''); // False
```

---------------------------------------

<a name="isObject" /></a>

### isObject

Return a boolean if the informed value is of Object type.

	isObject(value)

__Arguments__

* `value` - any value

```js
// Example
isObject({}); // True
isObject([]); // False
isObject(''); // False
```

---------------------------------------

<a name="isEmpty" /></a>

### isEmpty

Check if the informed value is empty. This is a little different of lodash behaviour,  
booleans are not considered empty and ' ' for example is considered empty.

	isEmpty(value)

__Arguments__

* `value` - any value

```js
// Examples
isEmpty(true); // false
isEmpty(null); // true
isEmpty(undefined); // true
isEmpty(' '); // true
isEmpty({}); // true
isEmpty([]); // true
```

---------------------------------------

<a name="isNotEmpty" /></a>

### isNotEmpty

Just the oposite of isEmpty.

	isNotEmpty(value)

__Arguments__

* `value` - any value

```js
// Examples
isNotEmpty(true); // true
isNotEmpty(null); // false
isNotEmpty(undefined); // false
isNotEmpty(' '); // false
isNotEmpty({}); // false
isNotEmpty([]); // false
```

---------------------------------------

<a name="toBoolean" /></a>

### toBoolean

Converts a give string or number into boolean or return null when cannot convert it.

	toBoolean(value)

__Arguments__

* `value` - any value

```js
// Examples
toBoolean(1); // true
toBoolean('true'); // true
toBoolean('yes'); // true
toBoolean('on'); // true
toBoolean(0); // false
toBoolean('false'); // false
toBoolean('no'); // false
toBoolean('off'); // false
toBoolean('lorem ipsum'); // null
```

---------------------------------------

<a name="removeEmpty" /></a>

### removeEmpty

Removes any empty property from object using isEmpty helper.

	removeEmpty(value)

__Arguments__

* `value` - any object

```js
// Example
removeEmpty({"a": " ", "b": "b value", "c": null}); // {"b": "b value"}
```

---------------------------------------

<a name="mapEmptyToNull" /></a>

### mapEmptyToNull

Converts any empty property of object to null using isEmpty helper.

	mapEmptyToNull(value)

__Arguments__

* `value` - any object

```js
// Example
mapEmptyToNull({"a": " ", "b": "b value", "c": null, "d": {}}); // {"a": null, "b": "b value", "c": null, "d": null}
```

## Authors

This library was developed by Gustavo Siqueira

## Contribute

Please do! Check out our [Contributing guidelines](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2018-2018 Brid-IT
