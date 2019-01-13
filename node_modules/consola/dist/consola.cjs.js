'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var chalk = _interopDefault(require('chalk'));
var figures = _interopDefault(require('figures'));
var startCase = _interopDefault(require('lodash/startCase'));
var env = _interopDefault(require('std-env'));

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var types = {
  fatal: {
    level: 0,
    color: 'red'
  },
  error: {
    level: 0,
    color: 'red'
  },
  warn: {
    level: 1,
    color: 'yellow'
  },
  log: {
    level: 2,
    color: 'white'
  },
  info: {
    level: 2,
    color: 'blue'
  },
  start: {
    level: 3,
    color: 'blue'
  },
  success: {
    level: 3,
    color: 'green'
  },
  ready: {
    level: 3,
    color: 'green'
  },
  debug: {
    level: 4,
    color: 'grey'
  },
  trace: {
    level: 5,
    color: 'white'
  }
};

var Consola =
/*#__PURE__*/
function () {
  function Consola() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Consola);

    this.reporters = options.reporters || [];
    this.types = Object.assign({}, types, options.types);
    this.level = options.level != null ? options.level : 3;
    Object.assign(this, this.withDefaults());
  }

  _createClass(Consola, [{
    key: "withDefaults",
    value: function withDefaults(defaults) {
      var logger = {};

      for (var type in this.types) {
        logger[type] = this._createLogFn(Object.assign({
          type: type
        }, this.types[type], defaults));
      }

      return logger;
    }
  }, {
    key: "_createLogFn",
    value: function _createLogFn(defaults) {
      var _this = this;

      return function (opts) {
        if (!opts) {
          return _this;
        }

        var logObj = Object.assign({
          date: new Date()
        }, defaults);

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var argsStr = Array.from(args).map(String).join(' ');

        if (typeof opts === 'string') {
          // String
          logObj.message = opts;
          logObj.additional = argsStr;
        } else if (opts.stack) {
          // Error
          var _opts$stack$split = opts.stack.split('\n'),
              _opts$stack$split2 = _toArray(_opts$stack$split),
              message = _opts$stack$split2[0],
              stack = _opts$stack$split2.slice(1);

          logObj.message = message;
          logObj.additional = (argsStr.length ? argsStr + '\n' : '') + stack.map(function (s) {
            return s.trim();
          }).join('\n');
        } else {
          // Object
          Object.assign(logObj, opts);
        }

        _this._log(logObj);

        return _this;
      };
    }
  }, {
    key: "_log",
    value: function _log(logObj) {
      if (logObj.level > this.level) {
        return;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.reporters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var reporter = _step.value;
          reporter.log(logObj);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this;
    }
  }, {
    key: "add",
    value: function add(reporter) {
      this.reporters.push(reporter);
      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.reporters.splice(0);
      return this;
    }
  }, {
    key: "remove",
    value: function remove(reporter) {
      var i = this.reporters.indexOf(reporter);

      if (i >= 0) {
        return this.reporters.splice(i, 1);
      }

      return this;
    }
  }, {
    key: "withScope",
    value: function withScope(scope) {
      return this.withDefaults({
        scope: scope
      });
    }
  }]);

  return Consola;
}(); // Upward compatibility support to >= v2
Consola.prototype.addReporter = Consola.prototype.add;
Consola.prototype.removeReporter = Consola.prototype.remove;
Consola.prototype.removeReporter = Consola.prototype.clear;
Consola.prototype.withTag = Consola.prototype.withScope;

var BasicReporter =
/*#__PURE__*/
function () {
  function BasicReporter(stream) {
    _classCallCheck(this, BasicReporter);

    this.stream = stream || process.stdout;
  }

  _createClass(BasicReporter, [{
    key: "formatTag",
    value: function formatTag(tag) {
      return "[".concat(tag.toUpperCase(), "]");
    }
  }, {
    key: "log",
    value: function log(logObj) {
      var l = [this.formatTag(logObj.date.toLocaleTimeString())];

      if (logObj.scope) {
        l.push(this.formatTag(logObj.scope));
      }

      l.push(logObj.message);
      this.stream.write(l.join(' ') + '\n');

      if (logObj.additional) {
        this.stream.write(logObj.additional + '\n');
      }
    }
  }]);

  return BasicReporter;
}();

var NS_SEPARATOR = chalk.blue(figures(' › '));
var ICONS = {
  start: figures('●'),
  info: figures('ℹ'),
  success: figures('✔'),
  error: figures('✖'),
  fatal: figures('✖'),
  warn: figures('⚠'),
  debug: figures('…'),
  trace: figures('…'),
  default: figures('❯'),
  ready: figures('♥')
};

var FancyReporter =
/*#__PURE__*/
function () {
  function FancyReporter(stream) {

    _classCallCheck(this, FancyReporter);

    this.stream = stream || process.stderr;
  }

  _createClass(FancyReporter, [{
    key: "formatBadge",
    value: function formatBadge(type) {
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'blue';
      return chalk['bg' + startCase(color)].black(" ".concat(type.toUpperCase(), " ")) + ' ';
    }
  }, {
    key: "formatTag",
    value: function formatTag(type) {
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'blue';
      var icon = arguments.length > 2 ? arguments[2] : undefined;
      return chalk[color]("".concat(icon, " ").concat(type.toLowerCase())) + ' ';
    }
  }, {
    key: "clear",
    value: function clear() {
      this.stream.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
    }
  }, {
    key: "log",
    value: function log(logObj) {
      var message = logObj.message;

      if (logObj.scope) {
        message = (logObj.scope.replace(/:/g, '>') + '>').split('>').join(NS_SEPARATOR) + message;
      }

      if (logObj.clear) {
        this.clear();
      }

      var icon = logObj.icon || ICONS[logObj.type] || ICONS.default;

      if (logObj.badge) {
        this.stream.write('\n\n' + this.formatBadge(logObj.type, logObj.color, icon) + message + '\n\n');
      } else {
        this.stream.write(this.formatTag(logObj.type, logObj.color, icon) + message + '\n');
      }

      if (logObj.additional) {
        var lines = logObj.additional.split('\n').map(function (s) {
          return '  ' + s;
        }).join('\n');
        this.stream.write(chalk[logObj.additionalStyle || 'grey'](lines) + '\n');
      }
    }
  }]);

  return FancyReporter;
}();

var JSONReporter =
/*#__PURE__*/
function () {
  function JSONReporter(stream) {
    _classCallCheck(this, JSONReporter);

    this.stream = stream || process.stdout;
  }

  _createClass(JSONReporter, [{
    key: "log",
    value: function log(logObj) {
      this.stream.write(JSON.stringify(logObj) + '\n');
    }
  }]);

  return JSONReporter;
}();

// This reporter is compatible with Winston 3
// https://github.com/winstonjs/winston
var WinstonReporter =
/*#__PURE__*/
function () {
  function WinstonReporter(logger) {
    _classCallCheck(this, WinstonReporter);

    this.logger = logger;
  }

  _createClass(WinstonReporter, [{
    key: "log",
    value: function log(logObj) {
      this.logger.log({
        level: levels[logObj.level] || 'info',
        label: logObj.tag,
        message: logObj.message,
        timestamp: logObj.date.getTime() / 1000
      });
    }
  }]);

  return WinstonReporter;
}();
var levels = {
  0: 'error',
  1: 'warn',
  2: 'info',
  3: 'verbose',
  4: 'debug',
  5: 'silly'
};

var Reporters = {
  BasicReporter: BasicReporter,
  FancyReporter: FancyReporter,
  JSONReporter: JSONReporter,
  WinstonReporter: WinstonReporter
};

// duplicated instances when used with different packages/versions

var consola = global && global.consola;

if (!consola) {
  consola = new Consola({
    level: env.debug ? 4 : 3
  });

  if (env.minimalCLI) {
    consola.add(new Reporters.BasicReporter());
  } else {
    consola.add(new Reporters.FancyReporter());
  }

  Object.assign(consola, {
    Consola: Consola
  }, Reporters);
  global.consola = consola;
}

var consola$1 = consola;

module.exports = consola$1;
