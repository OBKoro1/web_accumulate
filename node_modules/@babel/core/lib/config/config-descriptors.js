"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCachedDescriptors = createCachedDescriptors;
exports.createUncachedDescriptors = createUncachedDescriptors;
exports.createDescriptor = createDescriptor;

var _files = require("./files");

var _item = require("./item");

var _caching = require("./caching");

function createCachedDescriptors(dirname, options, alias) {
  const plugins = options.plugins,
        presets = options.presets,
        passPerPreset = options.passPerPreset;
  return {
    options,
    plugins: plugins ? () => createCachedPluginDescriptors(plugins, dirname)(alias) : () => [],
    presets: presets ? () => createCachedPresetDescriptors(presets, dirname)(alias)(!!passPerPreset) : () => []
  };
}

function createUncachedDescriptors(dirname, options, alias) {
  let plugins;
  let presets;
  return {
    options,
    plugins: function (_plugins) {
      function plugins() {
        return _plugins.apply(this, arguments);
      }

      plugins.toString = function () {
        return _plugins.toString();
      };

      return plugins;
    }(() => {
      if (!plugins) {
        plugins = createPluginDescriptors(options.plugins || [], dirname, alias);
      }

      return plugins;
    }),
    presets: function (_presets) {
      function presets() {
        return _presets.apply(this, arguments);
      }

      presets.toString = function () {
        return _presets.toString();
      };

      return presets;
    }(() => {
      if (!presets) {
        presets = createPresetDescriptors(options.presets || [], dirname, alias, !!options.passPerPreset);
      }

      return presets;
    })
  };
}

const createCachedPresetDescriptors = (0, _caching.makeWeakCache)((items, cache) => {
  const dirname = cache.using(dir => dir);
  return (0, _caching.makeStrongCache)(alias => (0, _caching.makeStrongCache)(passPerPreset => createPresetDescriptors(items, dirname, alias, passPerPreset)));
});
const createCachedPluginDescriptors = (0, _caching.makeWeakCache)((items, cache) => {
  const dirname = cache.using(dir => dir);
  return (0, _caching.makeStrongCache)(alias => createPluginDescriptors(items, dirname, alias));
});

function createPresetDescriptors(items, dirname, alias, passPerPreset) {
  return createDescriptors("preset", items, dirname, alias, passPerPreset);
}

function createPluginDescriptors(items, dirname, alias) {
  return createDescriptors("plugin", items, dirname, alias);
}

function createDescriptors(type, items, dirname, alias, ownPass) {
  const descriptors = items.map((item, index) => createDescriptor(item, dirname, {
    type,
    alias: `${alias}$${index}`,
    ownPass: !!ownPass
  }));
  assertNoDuplicates(descriptors);
  return descriptors;
}

function createDescriptor(pair, dirname, {
  type,
  alias,
  ownPass
}) {
  const desc = (0, _item.getItemDescriptor)(pair);

  if (desc) {
    return desc;
  }

  let name;
  let options;
  let value = pair;

  if (Array.isArray(value)) {
    if (value.length === 3) {
      var _value = value;
      value = _value[0];
      options = _value[1];
      name = _value[2];
    } else {
      var _value2 = value;
      value = _value2[0];
      options = _value2[1];
    }
  }

  let file = undefined;
  let filepath = null;

  if (typeof value === "string") {
    if (typeof type !== "string") {
      throw new Error("To resolve a string-based item, the type of item must be given");
    }

    const resolver = type === "plugin" ? _files.loadPlugin : _files.loadPreset;
    const request = value;

    var _resolver = resolver(value, dirname);

    filepath = _resolver.filepath;
    value = _resolver.value;
    file = {
      request,
      resolved: filepath
    };
  }

  if (!value) {
    throw new Error(`Unexpected falsy value: ${String(value)}`);
  }

  if (typeof value === "object" && value.__esModule) {
    if (value.default) {
      value = value.default;
    } else {
      throw new Error("Must export a default export when using ES6 modules.");
    }
  }

  if (typeof value !== "object" && typeof value !== "function") {
    throw new Error(`Unsupported format: ${typeof value}. Expected an object or a function.`);
  }

  if (filepath !== null && typeof value === "object" && value) {
    throw new Error(`Plugin/Preset files are not allowed to export objects, only functions. In ${filepath}`);
  }

  return {
    name,
    alias: filepath || alias,
    value,
    options,
    dirname,
    ownPass,
    file
  };
}

function assertNoDuplicates(items) {
  const map = new Map();

  for (var _iterator = items, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    const item = _ref;
    if (typeof item.value !== "function") continue;
    let nameMap = map.get(item.value);

    if (!nameMap) {
      nameMap = new Set();
      map.set(item.value, nameMap);
    }

    if (nameMap.has(item.name)) {
      throw new Error([`Duplicate plugin/preset detected.`, `If you'd like to use two separate instances of a plugin,`, `they neen separate names, e.g.`, ``, `  plugins: [`, `    ['some-plugin', {}],`, `    ['some-plugin', {}, 'some unique name'],`, `  ]`].join("\n"));
    }

    nameMap.add(item.name);
  }
}