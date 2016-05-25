About
=====

The temptation of extending prototypes is always there, lurking in the shadows when
writing javascript, but it is never a good idea. Its abuse has prevented the
development of the web (it's the reason why Array.prototype.contains won't
exist any time soon).

I present to you a much safer solution. A wrapper that enables you to define methods
on top of any type (except null and undefined), so that you can keep things nice
and object oriented!

Usage
=====

My recommended way to use this module is to create a extensions module for your
project that exports an instance of `VirtualPrototype`. Then you can import that
module throughout your project.

Another way to use the module would be to create an npm package containing
a frozen singleton instance of set of utility (akin to lodash). After all methods
have been added you can call `finalize` on the instance to prevent editing.
This would also prevent monkey patching, so whether to do that is up to you.

Virtually extending types
-------------------------

```javascript
var VirtualPrototype = require('virtual-prototype')
var vp = VirtualPrototype();

// define the types you wish to "extend"..

vp.defineType('string');       // checks type with typeof
vp.defineType('array', Array); // checks type with instanceof

// ..define the methods on the virtual prototypes.

vp.string.define('secondCharacter', function () {
    if (this.length < 2)
        return '';
    return this.charAt(2);
});

vp.array.define('last', function () {
    if (! this.length) {
        return null;
    }

    return this[this.length - 1];
});

vp('hello').secondCharacter(); // 'e'

vp([1, 2, 3]).last();          // 3
```

Creating general methods
------------------------

```javascript
var VirtualPrototype = require('virtual-prototype');
var vp = VirtualPrototype();

vp.appendString = function (str) {
    return this + str;
};

vp(9).appendString(' times');       // '9 times'
vp('Hello').appendString(' world'); // 'Hello world'
```

API documentation
=================

vp.defineType
-------------

### Arguments

typeAndIdentifier

Itentifier, constructor

### Example

```javascript
// Type checks using typeof (+ instanceof String if identifier is 'string')
vp.defineType('string');

// Type checks using instanceof
vp.defineType('array', Array);
```

vp.define
---------

### Arguments:

name, handler

### Example

```javascript
vp.define('toUppercaseString', function () {
    return this.toString().toUpperCase();
})

vp({}).toUppercaseString(); // '[OBJECT OBJECT]'
```

vp.&lt;type&gt;.define
------------------------

Define a method on the virtual prototype for the given
type. &lt;type&gt; must be defined using `defineType`
and must match the first parameter given to `defineType`.

### Example

```javascript

// Using just type (matched with typeof)
vp.defineType('string');

vp.string.define('reverse', function () {
    var result = '';

    for (var i = this.length - 1; i >= 0; i--) {
        result += this[i];
    }

    return result;
});

// Using constructor function as second argument (matched with instanceof)
vp.defineType('array', Array);

vp.array.define('reverse', function () {
    for (var i = 0, j = this.length - 1; i < this.length/2; i++, j--) {
        var tmp = this[i];
        this[i] = this[j];
        this[j] = tmp;
    }
    return this;
});
```

vp.finalize
-----------

Prevent further changes to the instance of `VirtualPrototype`.
After this, no new methods can be registered and no methods
can be altered/deleted.

Testing
=======

`npm test`

Notes
=====

* Overriding functions using `define(<existing-name>, <handler>)` for a given type is illegal and will throw a `TypeError`.
* null/undefined can not be captured by `vp()` as they can not be referenced by `this`. Throws a `TypeError`.

