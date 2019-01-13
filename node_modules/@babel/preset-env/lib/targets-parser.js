"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.semverMin = void 0;

function _browserslist() {
  const data = _interopRequireDefault(require("browserslist"));

  _browserslist = function _browserslist() {
    return data;
  };

  return data;
}

function _semver() {
  const data = _interopRequireDefault(require("semver"));

  _semver = function _semver() {
    return data;
  };

  return data;
}

var _utils = require("./utils");

var _normalizeOptions = require("./normalize-options");

var _builtInModules = _interopRequireDefault(require("../data/built-in-modules.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const browserNameMap = {
  android: "android",
  chrome: "chrome",
  and_chr: "chrome",
  edge: "edge",
  firefox: "firefox",
  ie: "ie",
  ios_saf: "ios",
  safari: "safari"
};

const isBrowsersQueryValid = browsers => typeof browsers === "string" || Array.isArray(browsers);

const semverMin = (first, second) => {
  return first && _semver().default.lt(first, second) ? first : second;
};

exports.semverMin = semverMin;

const mergeBrowsers = (fromQuery, fromTarget) => {
  return Object.keys(fromTarget).reduce((queryObj, targKey) => {
    if (targKey !== "browsers") {
      queryObj[targKey] = fromTarget[targKey];
    }

    return queryObj;
  }, fromQuery);
};

const getLowestVersions = browsers => {
  return browsers.reduce((all, browser) => {
    const _browser$split = browser.split(" "),
          browserName = _browser$split[0],
          browserVersion = _browser$split[1];

    const normalizedBrowserName = browserNameMap[browserName];

    if (!normalizedBrowserName) {
      return all;
    }

    try {
      const splitVersion = browserVersion.split("-")[0].toLowerCase();

      if ((0, _utils.isUnreleasedVersion)(splitVersion, browserName)) {
        all[normalizedBrowserName] = (0, _utils.getLowestUnreleased)(all[normalizedBrowserName], splitVersion, browserName);
      }

      const parsedBrowserVersion = (0, _utils.semverify)(splitVersion);
      all[normalizedBrowserName] = semverMin(all[normalizedBrowserName], parsedBrowserVersion);
    } catch (e) {}

    return all;
  }, {});
};

const outputDecimalWarning = decimalTargets => {
  if (!decimalTargets || !decimalTargets.length) {
    return;
  }

  console.log("Warning, the following targets are using a decimal version:");
  console.log("");
  decimalTargets.forEach(({
    target,
    value
  }) => console.log(`  ${target}: ${value}`));
  console.log("");
  console.log("We recommend using a string for minor/patch versions to avoid numbers like 6.10");
  console.log("getting parsed as 6.1, which can lead to unexpected behavior.");
  console.log("");
};

const targetParserMap = {
  __default: (target, value) => {
    const version = (0, _utils.isUnreleasedVersion)(value, target) ? value.toLowerCase() : (0, _utils.semverify)(value);
    return [target, version];
  },
  node: (target, value) => {
    const parsed = value === true || value === "current" ? process.versions.node : (0, _utils.semverify)(value);
    return [target, parsed];
  }
};

const getTargets = (targets = {}, options = {}) => {
  const targetOpts = {};

  if (targets.esmodules) {
    const supportsESModules = _builtInModules.default["es6.module"];
    targets.browsers = Object.keys(supportsESModules).map(browser => `${browser} ${supportsESModules[browser]}`).join(", ");
  }

  const queryIsValid = isBrowsersQueryValid(targets.browsers);
  const browsersquery = queryIsValid ? targets.browsers : null;

  if (queryIsValid || !options.ignoreBrowserslistConfig) {
    _browserslist().default.defaults = (0, _normalizeOptions.objectToBrowserslist)(targets);
    const browsers = (0, _browserslist().default)(browsersquery, {
      path: options.configPath
    });
    const queryBrowsers = getLowestVersions(browsers);
    targets = mergeBrowsers(queryBrowsers, targets);
  }

  const parsed = Object.keys(targets).filter(value => value !== "esmodules").sort().reduce((results, target) => {
    if (target !== "browsers") {
      const value = targets[target];

      if (typeof value === "number" && value % 1 !== 0) {
        results.decimalWarnings.push({
          target,
          value
        });
      }

      const parser = targetParserMap[target] || targetParserMap.__default;

      const _parser = parser(target, value),
            parsedTarget = _parser[0],
            parsedValue = _parser[1];

      if (parsedValue) {
        results.targets[parsedTarget] = parsedValue;
      }
    }

    return results;
  }, {
    targets: targetOpts,
    decimalWarnings: []
  });
  outputDecimalWarning(parsed.decimalWarnings);
  return parsed.targets;
};

var _default = getTargets;
exports.default = _default;