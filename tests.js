'use strict';

var virtualPrototype = require('./index');
var _ = virtualPrototype();

// Sample types
// ------------

_.defineType('string');
_.defineType('number');
_.defineType('function');
_.defineType('object');
_.defineType('array', Array);
_.defineType('date', Date);

// Sample functions
// ----------------

_.define('equals', function (other) {
    if (Array.isArray(this)) {
        if (! Array.isArray(other)) {
            return false;
        }
        for (var i = 0; i < this.length; i++) {
            if (! _(this[i]).equals(other[i])) {
                return false;
            }
        }
        return true
    }

    return this === other;
});

_.string.define('contains', function (other) {
    console.assert((this instanceof String) || (typeof this == 'string'));
    console.assert(typeof other == 'string');

    return (typeof other == 'string') && this.indexOf(other) !== -1;
});

_.string.define('newString', function () {
    return new String(this);
});

_.number.define('isPositive', function () {
    return this > 0;
});

_.array.define('last', function () {
    return this[this.length - 1];
});

_.array.define('contains', function (value) {
    console.assert(Array.isArray(this)); // for testing

    for (var i = 0; i < this.length; i++) {
        if (this[i] === value) {
            return true;
        }
    }
    return false;
});

_.define('toUppercaseString', function () {
    return (this + '').toUpperCase();
});

_.date.define('diff', function (other) {
    if (! (other instanceof Date)) {
        throw TypeError(other + ' is not a Date object');
    }

    if (this > other) {
        return this - other;
    }
    return other - this;
});

// Test utilities
// --------------

function assertError(fn, msg) {
    var errored;

    console.assert(typeof fn == 'function', 'assertError: did not recieve function');

    try {
        fn();
        console.log(msg + ' did not error')
        errored = false;
    } catch (err) {
        errored = true;
    }

    console.assert((errored), msg || 'Did not error');
}

// Tests
// -----

// Prepare print stream to not affect times
console.log();

var start = new Date();

console.assert(
    _('hello').contains('hel'),
    '"hello" should contain "hel"'
);

console.assert(
    ! _('lol').contains('cat'),
    '"lol" should not contain "cat"'
);

assertError(function () {
    _(9).contains('cat')
}, 'calling contains on 9 should throw an error');

console.assert(
    _(9).isPositive(),
    '9 should be positive'
);

console.assert(
    ! _(-1).isPositive(),
    '-1 should not be positive'
);

assertError(function () {
     _('hello').isPositive()
}, 'Calling isPositive on a string should throw an error');

console.assert(
    _([1, 2, 3]).last() === 3,
    'The last item of [1, 2, 3] should be 3'
);

assertError(function () {
    _('hello').last()
}, 'It should not be possible to call the array specific method last on a string');

// Finalize instance (to test that) and continue tests (to test for breakage)..

_.finalize();

console.assert(
    (_.define === undefined) && (_.defineType === undefined),
    'After finalizing, you should not be able to add methods'
);

assertError(function () {
    _.define('hello', function () { return 'world' });
}, 'After finalizing, you should not be able to add methods');

assertError(function () {
    _.funcs['TESTING'] = function () {}
}, 'After finalizing, you should not be able to add methods' );

console.assert(
    _([1, 2, 3]).contains(2)
);

console.assert(
    _({}).toUppercaseString() === '[OBJECT OBJECT]',
    'methods defined without a type should be possible to call for all non-null/undefined value'
);

console.assert(
    _(false).toUppercaseString() === 'FALSE',
    'methods defined without a type should be possible to call for all non-null/undefined value'
)

console.assert(
    _('hellO').toUppercaseString() === 'HELLO',
    'methods defined without a type should be possible to call for all non-null/undefined value'
)

assertError(function () {
    _(null)
}, 'methods defined without a value can not be called on null');

assertError(function () {
    _(undefined)
}, 'methods defined without a value can not be called on undefined');

console.assert(
    _(new Date(100)).diff(new Date(1000)) === 900,
    '_(Date).diff() should show the difference between two Date objects in ms.'
);

console.assert(
    _(new Date(1000)).diff(new Date(100)) === 900,
    '_(Date).diff() should show the difference between two Date objects in ms.'
);

console.assert(
    _('hello').newString() === 'hello'
);

var end = new Date();

console.log('All tests passed in ' + _(start).diff(end) + 'ms!');
