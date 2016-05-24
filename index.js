'use strict';

var _ = function (x) {
    if (x == null) {
        throw TypeError('virtual-prototype: Cannot call extended functions on undefined or null');
    }

    var result = {};

    Object.keys(_._funcs).forEach(function (name) {
        result[name] = function () {
            return _._funcs[name].apply(x, arguments);
        };
    });

    return result;
};

_._funcs = {}

_.define = function(name, fn) {
    if (typeof fn == 'function') {
        return _._funcs[name] = fn;
    }
    return _._funcs[name];
}

function defineFactory(typeName, type) {
    return function (name, fn) {
        var oldFn = _.define(name);

        if (_[typeName][name]) {
            throw TypeError('virtual-prototype: Cannot redefine ' + name + ' for ' + typeName);
        }

        _[typeName][name] = true;

        return _.define(name, function () {
            if (typeof type == 'string') {
                if (typeof this == type) {
                    return fn.apply(this, arguments);
                }
            } else {
                if (this instanceof type) {
                    return fn.apply(this, arguments);
                }
            }

            if (! oldFn) {
                throw TypeError('virtual-prototype: ' + name + ' is not defined for ' + typeof this);
            }

            return oldFn.apply(this, arguments);
        });
    }
}

_.defineType = function (name, proto) {
    if (! proto) {
        _[name] = {
            define: defineFactory(name, name)
        }
    } else {
        _[name] = {
            define: defineFactory(name, proto)
        }
    }
}

module.exports = _;
