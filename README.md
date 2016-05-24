About
=====

The temptation of extending prototypes is always there, lurking in the shadows when
writing javascript, but it is never a good idea. Its abuse has prevented the
development of the web (it's the reason why Array.prototype.contains won't
exist any time soon).

I present to you a much safer solution. A wrapper that enables you to define methods
on top of any type (except null and undefined), so that you can keep things nice
and object oriented!

To prevent dependency hell, you must first instantiate the module, as npm based
singletons are inherently unsafe, and should not contain state.

Usage
=====

My recommended way to use this module is to create a extensions module for your
project that exports an instance of virtualPrototype. Then you can import that
module throughout your project.

Another way to use the module would be to create an npm package containing
a frozen singleton instance of set of utility (akin to lodash). After all methods
have been added you can call `finalize` on the instance to prevent editing.
This would also prevent monkey patching, so whether to do that is up to you.

Virtually extending types
-------------------------

```javascript
var virtualPrototype = require('virtual-prototype')
var _ = virtualPrototype();

// define the types you wish to "extend"..

_.defineType('string');       // checks type with typeof
_.defineType('array', Array); // checks type with instanceof

// ..define the method on the virtual prototype.

_.string.define('secondCharacter', function () {
    if (this.length < 2)
        return '';
    return this.charAt(2);
});

_.array.define('last', function () {
    if (! this.length) {
        return null;
    }

    return this[this.length - 1];
});

_('hello').secondCharacter(); // 'e'

_([1, 2, 3]).last();          // 3
```

Creating general methods
------------------------

```javascript
var virtualPrototype = require('virtual-prototype');
var _ = virtualPrototype();

_.appendString = function (str) {
    return this + str;
};

_(9).appendString(' times'); // '9 times'
```

API documentation
=================

\_.defineType
-------------

### Arguments

typeAndIdentifier

Itentifier, prototype

### Example

```javascript
// Type checks using typeof (+ instanceof String if identifier is 'string')
_.defineType('string');

// Type checks using instanceof
_.defineType('array', Array);
```

\_.define
---------

### Arguments:

name, handler

### Example

```javascript
_.define('toUppercaseString', function () {
    return this.toString().toUpperCase();
})

_({}).toUppercaseString(); // '[OBJECT OBJECT]'
```

\_.&lt;type&gt;.define
------------------------

Define a method on the virtual prototype for the given
type. &lt;type&gt; must be defined using `defineType`
and must match the first parameter given to `defineType`.

### Example

```javascript
_.defineType('string');

_.string.define('reverse', function () {
    var result = '';

    for (var i = this.length - 1; i >= 0; i--) {
        result += this[i];
    }

    return result;
});
```

\_.finalize
-----------

Prevent further changes to the instance of VirtualPrototype.
After this, no new methods can be registered and no methods
can be altered/deleted.

Testing
=======

`npm test`

Notes
=====

* Overriding functions using define('') for a given type is illegal and will throw a TypeError.
* null/undefined can not be captured by `_()` as they can not be referenced by this. Throws a TypeError.

