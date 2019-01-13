import _gPO from "./getPrototypeOf";
import _sPO from "./setPrototypeOf";
import construct from "./construct";
export default function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {}

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _sPO(Wrapper, _sPO(function Super() {
      return construct(Class, arguments, _gPO(this).constructor);
    }, Class));
  };

  return _wrapNativeSuper(Class);
}