"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeStrongCache = makeStrongCache;
exports.makeWeakCache = makeWeakCache;

function makeStrongCache(handler) {
  return makeCachedFunction(new Map(), handler);
}

function makeWeakCache(handler) {
  return makeCachedFunction(new WeakMap(), handler);
}

function makeCachedFunction(callCache, handler) {
  return function cachedFunction(arg, data) {
    let cachedValue = callCache.get(arg);

    if (cachedValue) {
      for (var _iterator = cachedValue, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref2 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref2 = _i.value;
        }

        const _ref = _ref2;
        const value = _ref.value,
              valid = _ref.valid;
        if (valid(data)) return value;
      }
    }

    const cache = new CacheConfigurator(data);
    const value = handler(arg, cache);
    if (!cache.configured()) cache.forever();
    cache.deactivate();

    switch (cache.mode()) {
      case "forever":
        cachedValue = [{
          value,
          valid: () => true
        }];
        callCache.set(arg, cachedValue);
        break;

      case "invalidate":
        cachedValue = [{
          value,
          valid: cache.validator()
        }];
        callCache.set(arg, cachedValue);
        break;

      case "valid":
        if (cachedValue) {
          cachedValue.push({
            value,
            valid: cache.validator()
          });
        } else {
          cachedValue = [{
            value,
            valid: cache.validator()
          }];
          callCache.set(arg, cachedValue);
        }

    }

    return value;
  };
}

class CacheConfigurator {
  constructor(data) {
    this._active = true;
    this._never = false;
    this._forever = false;
    this._invalidate = false;
    this._configured = false;
    this._pairs = [];
    this._data = data;
  }

  simple() {
    return makeSimpleConfigurator(this);
  }

  mode() {
    if (this._never) return "never";
    if (this._forever) return "forever";
    if (this._invalidate) return "invalidate";
    return "valid";
  }

  forever() {
    if (!this._active) {
      throw new Error("Cannot change caching after evaluation has completed.");
    }

    if (this._never) {
      throw new Error("Caching has already been configured with .never()");
    }

    this._forever = true;
    this._configured = true;
  }

  never() {
    if (!this._active) {
      throw new Error("Cannot change caching after evaluation has completed.");
    }

    if (this._forever) {
      throw new Error("Caching has already been configured with .forever()");
    }

    this._never = true;
    this._configured = true;
  }

  using(handler) {
    if (!this._active) {
      throw new Error("Cannot change caching after evaluation has completed.");
    }

    if (this._never || this._forever) {
      throw new Error("Caching has already been configured with .never or .forever()");
    }

    this._configured = true;
    const key = handler(this._data);

    this._pairs.push([key, handler]);

    return key;
  }

  invalidate(handler) {
    if (!this._active) {
      throw new Error("Cannot change caching after evaluation has completed.");
    }

    if (this._never || this._forever) {
      throw new Error("Caching has already been configured with .never or .forever()");
    }

    this._invalidate = true;
    this._configured = true;
    const key = handler(this._data);

    this._pairs.push([key, handler]);

    return key;
  }

  validator() {
    const pairs = this._pairs;
    return data => pairs.every(([key, fn]) => key === fn(data));
  }

  deactivate() {
    this._active = false;
  }

  configured() {
    return this._configured;
  }

}

function makeSimpleConfigurator(cache) {
  function cacheFn(val) {
    if (typeof val === "boolean") {
      if (val) cache.forever();else cache.never();
      return;
    }

    return cache.using(val);
  }

  cacheFn.forever = () => cache.forever();

  cacheFn.never = () => cache.never();

  cacheFn.using = cb => cache.using(() => cb());

  cacheFn.invalidate = cb => cache.invalidate(() => cb());

  return cacheFn;
}