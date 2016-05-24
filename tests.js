var _ = require('./index');

'use strict';

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
    console.assert(this instanceof String);
    console.assert(typeof other == 'string');

    return (typeof other == 'string') && this.indexOf(other) !== -1;
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

    console.assert(typeof fn == 'function');

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

var start = new Date();

console.assert(
    _('hello').contains('hel')
);

console.assert(
    ! _('lol').contains('cat')
);

assertError(() => {
    _(9).contains('cat')
});

console.assert(
    _(9).isPositive()
);

console.assert(
    ! _(-1).isPositive()
);

assertError(() => {
     _('hello').isPositive()
});

console.assert(
    _([1, 2, 3]).last() === 3
);

assertError(() => {
    _('hello').last()
});

console.assert(
    _([1, 2, 3]).contains(2)
);

console.assert(
    _({}).toUppercaseString() === '[OBJECT OBJECT]'
);

console.assert(
    _(false).toUppercaseString() === 'FALSE'
)

console.assert(
    _('hellO').toUppercaseString() === 'HELLO'
)

assertError(() => {
    _(null)
});

assertError(() => {
    _(undefined)
});

console.assert(
    _(new Date(100)).diff(new Date(1000)) === 900
);

console.assert(
    _(new Date(1000)).diff(new Date(100)) === 900
);

var end = new Date();

console.log('All tests passed in ' + _(start).diff(end) + 'ms!');
