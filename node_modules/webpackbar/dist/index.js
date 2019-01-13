'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logUpdate = require('log-update');

var _logUpdate2 = _interopRequireDefault(_logUpdate);

var _stdEnv = require('std-env');

var _stdEnv2 = _interopRequireDefault(_stdEnv);

var _consola = require('consola');

var _consola2 = _interopRequireDefault(_consola);

var _prettyTime = require('pretty-time');

var _prettyTime2 = _interopRequireDefault(_prettyTime);

var _profile = require('./profile');

var _profile2 = _interopRequireDefault(_profile);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sharedState = {};

const defaults = {
  name: 'webpack',
  color: 'green',
  profile: false,
  compiledIn: true,
  done: null,
  minimal: _stdEnv2.default.minimalCLI,
  stream: null
};

const hasRunning = () => Object.keys(sharedState).map(k => sharedState[k]).find(s => s.isRunning);

const $logUpdate = _logUpdate2.default.create(process.stderr, {
  showCursor: false
});

class WebpackBarPlugin extends _webpack2.default.ProgressPlugin {
  constructor(options) {
    super();

    this.options = Object.assign({}, defaults, options);

    // this.handler will be called by webpack.ProgressPlugin
    this.handler = (percent, msg, ...details) => this.updateProgress(percent, msg, details);

    this._render = _lodash2.default.throttle(this.render, 100);

    this.logUpdate = this.options.logUpdate || $logUpdate;

    if (!this.state) {
      sharedState[this.options.name] = {
        isRunning: false,
        color: this.options.color,
        profile: this.options.profile ? new _profile2.default(this.options.name) : null
      };
    }
  }

  get state() {
    return sharedState[this.options.name];
  }

  get stream() {
    return this.options.stream || process.stderr;
  }

  apply(compiler) {
    super.apply(compiler);

    const hook = stats => {
      this.state.stats = stats;
      if (!hasRunning()) {
        this.logUpdate.clear();
        this.done();
      }
    };

    if (compiler.hooks) {
      compiler.hooks.done.tap('WebpackBar', hook);
    } else {
      compiler.plugin('done', hook);
    }
  }

  done() {
    if (this.options.profile) {
      const stats = this.state.profile.getStats();
      const statsStr = (0, _utils.formatStats)(stats);
      this.stream.write(`\n${statsStr}\n`);
    }

    if (typeof this.options.done === 'function') {
      this.options.done(sharedState, this);
    }
  }

  updateProgress(percent, msg, details) {
    const progress = Math.floor(percent * 100);
    const isRunning = progress < 100;

    const wasRunning = this.state.isRunning;

    Object.assign(this.state, {
      progress,
      msg: isRunning && msg ? msg : '',
      details: details || [],
      request: (0, _utils.parseRequst)(details[2]),
      isRunning
    });

    if (!wasRunning && isRunning) {
      // Started
      delete this.state.stats;
      this.state.start = process.hrtime();
      if (this.options.minimal) {
        _consola2.default.info(`Compiling ${this.options.name}`);
      }
    } else if (wasRunning && !isRunning) {
      // Finished
      const time = process.hrtime(this.state.start);
      if (this.options.minimal) {
        _consola2.default.success(`Compiled ${this.options.name} in ${(0, _prettyTime2.default)(time)}`);
      } else {
        this.logUpdate.clear();
        if (this.options.compiledIn) {
          _consola2.default.success(`${this.options.name} compiled in ${(0, _prettyTime2.default)(time, 'ms')}`);
        }
      }
      delete this.state.start;
    }

    if (this.options.profile) {
      this.state.profile.onRequest(this.state.request);
    }

    this._render();
  }

  render() {
    if (this.options.minimal) {
      return;
    }

    const columns = this.stream.columns || 80;

    const stateLines = _lodash2.default.sortBy(Object.keys(sharedState), n => n).map(name => {
      const state = sharedState[name];
      const color = (0, _utils.colorize)(state.color);

      if (!state.isRunning) {
        const color2 = state.progress === 100 ? color : _chalk2.default.grey;
        return color2(`${_utils.BULLET} ${name}\n`);
      }

      return `${[color(_utils.BULLET), color(name), (0, _utils.renderBar)(state.progress, state.color), state.msg, `(${state.progress || 0}%)`, _chalk2.default.grey(state.details && state.details[0] || ''), _chalk2.default.grey(state.details && state.details[1] || '')].join(' ')}\n ${state.request ? _chalk2.default.grey((0, _utils.elipsesLeft)((0, _utils.formatRequest)(state.request), columns - 2)) : ''}\n`;
    });

    if (hasRunning()) {
      const title = _chalk2.default.underline.blue('Compiling');
      const log = `\n${title}\n\n${stateLines.join('\n')}`;
      this.logUpdate(log);
    }
  }
}
exports.default = WebpackBarPlugin;