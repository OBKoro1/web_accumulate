"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalizeOptions;
exports.validateUseBuiltInsOption = exports.objectToBrowserslist = exports.validateModulesOption = exports.validateIgnoreBrowserslistConfig = exports.validateBoolOption = exports.validateConfigPathOption = exports.checkDuplicateIncludeExcludes = exports.normalizePluginName = void 0;

function _invariant() {
  const data = _interopRequireDefault(require("invariant"));

  _invariant = function _invariant() {
    return data;
  };

  return data;
}

function _browserslist() {
  const data = _interopRequireDefault(require("browserslist"));

  _browserslist = function _browserslist() {
    return data;
  };

  return data;
}

var _builtIns = _interopRequireDefault(require("../data/built-ins.json"));

var _defaultIncludes = require("./default-includes");

var _moduleTransformations = _interopRequireDefault(require("./module-transformations"));

var _plugins = _interopRequireDefault(require("../data/plugins.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validIncludesAndExcludes = new Set([...Object.keys(_plugins.default), ...Object.keys(_moduleTransformations.default).map(m => _moduleTransformations.default[m]), ...Object.keys(_builtIns.default), ..._defaultIncludes.defaultWebIncludes]);

const pluginToRegExp = plugin => {
  if (plugin instanceof RegExp) return plugin;

  try {
    return new RegExp(`^${normalizePluginName(plugin)}$`);
  } catch (e) {
    return null;
  }
};

const selectPlugins = regexp => Array.from(validIncludesAndExcludes).filter(item => regexp instanceof RegExp && regexp.test(item));

const flatten = array => [].concat(...array);

const expandIncludesAndExcludes = (plugins = [], type) => {
  if (plugins.length === 0) return [];
  const selectedPlugins = plugins.map(plugin => selectPlugins(pluginToRegExp(plugin)));
  const invalidRegExpList = plugins.filter((p, i) => selectedPlugins[i].length === 0);
  (0, _invariant().default)(invalidRegExpList.length === 0, `Invalid Option: The plugins/built-ins '${invalidRegExpList.join(", ")}' passed to the '${type}' option are not
    valid. Please check data/[plugin-features|built-in-features].js in babel-preset-env`);
  return flatten(selectedPlugins);
};

const validBrowserslistTargets = [...Object.keys(_browserslist().default.data), ...Object.keys(_browserslist().default.aliases)];

const normalizePluginName = plugin => plugin.replace(/^babel-plugin-/, "");

exports.normalizePluginName = normalizePluginName;

const checkDuplicateIncludeExcludes = (include = [], exclude = []) => {
  const duplicates = include.filter(opt => exclude.indexOf(opt) >= 0);
  (0, _invariant().default)(duplicates.length === 0, `Invalid Option: The plugins/built-ins '${duplicates.join(", ")}' were found in both the "include" and
    "exclude" options.`);
};

exports.checkDuplicateIncludeExcludes = checkDuplicateIncludeExcludes;

const validateConfigPathOption = (configPath = process.cwd()) => {
  (0, _invariant().default)(typeof configPath === "string", `Invalid Option: The configPath option '${configPath}' is invalid, only strings are allowed.`);
  return configPath;
};

exports.validateConfigPathOption = validateConfigPathOption;

const validateBoolOption = (name, value, defaultValue) => {
  if (typeof value === "undefined") {
    value = defaultValue;
  }

  if (typeof value !== "boolean") {
    throw new Error(`Preset env: '${name}' option must be a boolean.`);
  }

  return value;
};

exports.validateBoolOption = validateBoolOption;

const validateIgnoreBrowserslistConfig = ignoreBrowserslistConfig => validateBoolOption("ignoreBrowserslistConfig", ignoreBrowserslistConfig, false);

exports.validateIgnoreBrowserslistConfig = validateIgnoreBrowserslistConfig;

const validateModulesOption = (modulesOpt = "commonjs") => {
  (0, _invariant().default)(modulesOpt === false || Object.keys(_moduleTransformations.default).indexOf(modulesOpt) > -1, `Invalid Option: The 'modules' option must be either 'false' to indicate no modules, or a
    module type which can be be one of: 'commonjs' (default), 'amd', 'umd', 'systemjs'.`);
  return modulesOpt;
};

exports.validateModulesOption = validateModulesOption;

const objectToBrowserslist = object => {
  return Object.keys(object).reduce((list, targetName) => {
    if (validBrowserslistTargets.indexOf(targetName) >= 0) {
      const targetVersion = object[targetName];
      return list.concat(`${targetName} ${targetVersion}`);
    }

    return list;
  }, []);
};

exports.objectToBrowserslist = objectToBrowserslist;

const validateUseBuiltInsOption = (builtInsOpt = false) => {
  (0, _invariant().default)(builtInsOpt === "usage" || builtInsOpt === false || builtInsOpt === "entry", `Invalid Option: The 'useBuiltIns' option must be either
    'false' (default) to indicate no polyfill,
    '"entry"' to indicate replacing the entry polyfill, or
    '"usage"' to import only used polyfills per file`);
  return builtInsOpt;
};

exports.validateUseBuiltInsOption = validateUseBuiltInsOption;

function normalizeOptions(opts) {
  const include = expandIncludesAndExcludes(opts.include, "include");
  const exclude = expandIncludesAndExcludes(opts.exclude, "exclude");
  checkDuplicateIncludeExcludes(include, exclude);
  return {
    configPath: validateConfigPathOption(opts.configPath),
    debug: opts.debug,
    include,
    exclude,
    forceAllTransforms: validateBoolOption("forceAllTransforms", opts.forceAllTransforms, false),
    ignoreBrowserslistConfig: validateIgnoreBrowserslistConfig(opts.ignoreBrowserslistConfig),
    loose: validateBoolOption("loose", opts.loose, false),
    modules: validateModulesOption(opts.modules),
    shippedProposals: validateBoolOption("shippedProposals", opts.shippedProposals, false),
    spec: validateBoolOption("loose", opts.spec, false),
    targets: Object.assign({}, opts.targets),
    useBuiltIns: validateUseBuiltInsOption(opts.useBuiltIns)
  };
}