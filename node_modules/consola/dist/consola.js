(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.consola = factory());
}(this, (function () { 'use strict';

  var Types = {
    // Level 0
    fatal: {
      level: 0
    },
    error: {
      level: 0
    },
    // Level 1
    warn: {
      level: 1
    },
    // Level 2
    log: {
      level: 2
    },
    // Level 3
    info: {
      level: 3
    },
    success: {
      level: 3
    },
    // Level 4
    debug: {
      level: 4
    },
    // Level 5
    trace: {
      level: 5
    },
    // Silent
    silent: {
      level: Infinity
    },
    // Legacy
    ready: {
      level: 3
    },
    start: {
      level: 3
    }
  };

  function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }
  function isLogObj(arg) {
    // Should be plain object
    // Also contains either message or args field
    return isPlainObject(arg) && Boolean(arg.message || arg.args);
  }

  let paused = false;
  const queue = [];
  class Consola {
    constructor(options = {}) {
      this._reporters = options.reporters || [];
      this._types = options.types || Types;
      this._level = options.level != null ? options.level : 3;
      this._defaults = options.defaults || {};
      this._async = typeof options.async !== 'undefined' ? options.async : null;
      this._stdout = options.stdout;
      this._stderr = options.stdout;
      this._mockFn = options.mockFn; // Create logger functions for current instance

      for (const type in this._types) {
        this[type] = this._wrapLogFn(Object.assign({
          type
        }, this._types[type], this._defaults));
      } // Use _mockFn if is set


      if (this._mockFn) {
        this.mockTypes();
      }
    }

    get level() {
      return this._level;
    }

    set level(newLevel) {
      // Ensure that newLevel does not exceeds type level boundaries
      let min = 0;
      let max = 0;

      for (const typeName in this._types) {
        const type = this._types[typeName];

        if (type.level > max) {
          max = type.level;
        } else if (type.level < min) {
          min = type.level;
        }
      } // Set level


      this._level = Math.min(max, Math.max(min, newLevel));
    }

    get stdout() {
      return this._stdout || console._stdout; // eslint-disable-line no-console
    }

    get stderr() {
      return this._stderr || console._stderr; // eslint-disable-line no-console
    }

    create(options) {
      return new Consola(Object.assign({
        reporters: this._reporters,
        level: this._level,
        types: this._types,
        defaults: this._defaults,
        stdout: this._stdout,
        stderr: this._stderr,
        mockFn: this._mockFn
      }, options));
    }

    addReporter(reporter) {
      this._reporters.push(reporter);

      return this;
    }

    removeReporter(reporter) {
      if (reporter) {
        const i = this._reporters.indexOf(reporter);

        if (i >= 0) {
          return this._reporters.splice(i, 1);
        }
      } else {
        this._reporters.splice(0);
      }

      return this;
    }

    setReporters(reporters) {
      this._reporters = Array.isArray(reporters) ? reporters : [reporters];
    }

    withDefaults(defaults) {
      return this.create({
        defaults: Object.assign({}, this._defaults, defaults)
      });
    }

    withTag(tag) {
      return this.withDefaults({
        tag: this._defaults.tag ? this._defaults.tag + ':' + tag : tag
      });
    }

    wrapAll() {
      this.wrapConsole();
      this.wrapStd();
    }

    restoreAll() {
      this.restoreConsole();
      this.restoreStd();
    }

    wrapConsole() {
      for (const type in this._types) {
        // Backup original value
        if (!console['__' + type]) {
          // eslint-disable-line no-console
          console['__' + type] = console[type]; // eslint-disable-line no-console
        } // Override


        console[type] = this[type]; // eslint-disable-line no-console
      }
    }

    restoreConsole() {
      for (const type in this._types) {
        // Restore if backup is available
        if (console['__' + type]) {
          // eslint-disable-line no-console
          console[type] = console['__' + type]; // eslint-disable-line no-console

          delete console['__' + type]; // eslint-disable-line no-console
        }
      }
    }

    wrapStd() {
      this._wrapStream(this.stdout, 'log');

      this._wrapStream(this.stderr, 'log');
    }

    _wrapStream(stream, type) {
      if (!stream) {
        return;
      } // Backup original value


      if (!stream.__write) {
        stream.__write = stream.write;
      } // Override


      stream.write = data => {
        this[type](String(data).trim());
      };
    }

    restoreStd() {
      this._restoreStream(this.stdout);

      this._restoreStream(this.stderr);
    }

    _restoreStream(stream) {
      if (!stream) {
        return;
      }

      if (stream.__write) {
        stream.write = stream.__write;
        delete stream.__write;
      }
    }

    pauseLogs() {
      paused = true;
    }

    resumeLogs() {
      paused = false; // Process queue

      const _queue = queue.splice(0);

      for (const item of _queue) {
        item[0]._logFn(item[1], item[2]);
      }
    }

    mockTypes(mockFn) {
      this._mockFn = mockFn || this._mockFn;

      if (typeof this._mockFn !== 'function') {
        return;
      }

      for (const type in this._types) {
        this[type] = this._mockFn(type, this._types[type]) || this[type];
      }
    }

    _wrapLogFn(defaults) {
      function logFn() {
        if (paused) {
          queue.push([this, defaults, arguments]);
          return;
        }

        return this._logFn(defaults, arguments);
      }

      return logFn.bind(this);
    }

    _logFn(defaults, args) {
      if (defaults.level > this._level) {
        return this._async ? Promise.resolve(false) : false;
      } // Construct a new log object


      const logObj = Object.assign({
        date: new Date(),
        args: []
      }, defaults); // Consume arguments

      if (args.length === 1 && isLogObj(args[0])) {
        Object.assign(logObj, args[0]);
      } else {
        logObj.args = Array.from(args);
      } // Aliases


      if (logObj.message) {
        logObj.args.unshift(logObj.message);
        delete logObj.message;
      }

      if (logObj.additional) {
        if (!Array.isArray(logObj.additional)) {
          logObj.additional = logObj.additional.split('\n');
        }

        logObj.args.push('\n' + logObj.additional.join('\n'));
        delete logObj.additional;
      } // Log


      if (this._async) {
        return this._logAsync(logObj);
      } else {
        this._log(logObj);
      }
    }

    _log(logObj) {
      for (const reporter of this._reporters) {
        reporter.log(logObj, {
          async: false,
          stdout: this.stdout,
          stderr: this.stderr
        });
      }
    }

    _logAsync(logObj) {
      return Promise.all(this._reporters.map(reporter => reporter.log(logObj, {
        async: true,
        stdout: this.stdout,
        stderr: this.stderr
      })));
    }

  } // Legacy support

  Consola.prototype.add = Consola.prototype.addReporter;
  Consola.prototype.remove = Consola.prototype.removeReporter;
  Consola.prototype.clear = Consola.prototype.removeReporter;
  Consola.prototype.withScope = Consola.prototype.withTag;
  Consola.prototype.mock = Consola.prototype.mockTypes;
  Consola.prototype.pause = Consola.prototype.pauseLogs;
  Consola.prototype.resume = Consola.prototype.resumeLogs;

  const TYPE_COLOR_MAP = {
    'info': 'cyan'
  };
  const LEVEL_COLOR_MAP = {
    0: 'red',
    1: 'yellow',
    2: 'white',
    3: 'green'
  };

  class BrowserReporter {
    constructor(options) {
      this.options = Object.assign({}, options);
    }

    log(logObj) {
      // consoleLogFn
      let consoleLogFn = console[logObj.type]; // eslint-disable-line no-console

      if (!consoleLogFn) {
        consoleLogFn = console[logObj.level < 2 ? 'error' : 'log']; // eslint-disable-line no-console
      } // Type


      const type = logObj.type.toUpperCase(); // Styles

      const color = TYPE_COLOR_MAP[logObj.type] || LEVEL_COLOR_MAP[logObj.level];
      const styleColor = `color: ${color}; background-color: inherit;`;
      const styleInherit = `color: inherit; background-color: inherit;`;
      const styleAdditional = `color: ${logObj.additionalColor || 'grey'}; background-color: inherit;`; // Date

      const date = new Date(logObj.date).toLocaleTimeString(); // Log to the console

      consoleLogFn(`%c[${type}]%c[${date}]%c`, styleColor, styleAdditional, styleInherit, ...logObj.args);
    }

  }

  if (!window.consola) {
    // Create new consola instance
    window.consola = new Consola({
      reporters: [new BrowserReporter()]
    });
  }

  var browser = window.consola;

  return browser;

})));
