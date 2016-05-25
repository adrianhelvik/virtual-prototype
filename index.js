module.exports = function VirtualPrototypeContainer() {
    'use strict';

    // TODO: Replace with proxy if supported
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

    function define(name, fn) {
        if (typeof name != 'string' && ! (name instanceof String))
            throw TypeError('virtual-prototype: define was passed non string as name. Got ' + name);

        if (typeof fn != 'function')
            throw TypeError('virtual-prototype: define was passed non function for "' + name + '". Got ' + fn);

        _._funcs[name] = fn;

        return _;
    }

    _._funcs = {}

    _._registered = {}; // for tracking which methods of specific types have been added

    _.define = define;

    _.get = function(name) {
        return _._funcs[name];
    }

    function defineFactory(typeName, type) {
        _._registered[typeName] = {};

        return function (name, fn) {
            var oldFn = _.get(name);

            if (_._registered[typeName][name]) {
                throw TypeError('virtual-prototype: Cannot redefine ' + name + ' for ' + typeName);
            }

            _._registered[typeName][name] = true;

            return define(name, function () {
                if (typeof type == 'string' || type instanceof String) {
                    if (typeof this == type || (typeName === 'string' && this instanceof String)) {
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

    _.finalize = function () {
        delete _.define;
        delete _.defineType;

        Object.freeze(_._funcs);
        Object.freeze(_._registered);

        delete _.finalize;
    }

    return _;
};
