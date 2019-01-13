'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatStats = exports.formatRequest = exports.parseRequst = exports.renderBar = exports.colorize = exports.TICK = exports.BULLET = undefined;
exports.elipses = elipses;
exports.elipsesLeft = elipsesLeft;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _figures = require('figures');

var _figures2 = _interopRequireDefault(_figures);

var _table = require('table');

var _prettyTime = require('pretty-time');

var _prettyTime2 = _interopRequireDefault(_prettyTime);

var _description = require('./description');

var _description2 = _interopRequireDefault(_description);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BAR_LENGTH = 25;
const BLOCK_CHAR = '█';
const BLOCK_CHAR2 = '█';
const NEXT = _chalk2.default.blue((0, _figures2.default)(' › '));

const BULLET = exports.BULLET = (0, _figures2.default)('●');
const TICK = exports.TICK = _chalk2.default.green((0, _figures2.default)('✔'));

const colorize = exports.colorize = color => {
  if (color[0] === '#') {
    return _chalk2.default.hex(color);
  }

  return _chalk2.default[color] || _chalk2.default.keyword(color);
};

const renderBar = exports.renderBar = (progress, color) => {
  const w = progress * (BAR_LENGTH / 100);
  const bg = _chalk2.default.white(BLOCK_CHAR);
  const fg = colorize(color)(BLOCK_CHAR2);

  return _lodash2.default.range(BAR_LENGTH).map(i => i < w ? fg : bg).join('');
};

const hasValue = s => s && s.length;

const nodeModules = `${_path2.default.delimiter}node_modules${_path2.default.delimiter}`;
const removeAfter = (delimiter, str) => _lodash2.default.first(str.split(delimiter));
const removeBefore = (delimiter, str) => _lodash2.default.last(str.split(delimiter));

const firstMatch = (regex, str) => {
  const m = regex.exec(str);
  return m ? m[0] : null;
};

const parseRequst = exports.parseRequst = requestStr => {
  const parts = (requestStr || '').split('!');

  const file = _path2.default.relative(process.cwd(), removeAfter('?', removeBefore(nodeModules, parts.pop())));

  const loaders = parts.map(part => firstMatch(/[a-z0-9-@]+-loader/, part)).filter(hasValue);

  return {
    file: hasValue(file) ? file : null,
    loaders
  };
};

const formatRequest = exports.formatRequest = request => {
  const loaders = request.loaders.join(NEXT);

  if (!loaders.length) {
    return request.file || '';
  }

  return `${loaders}${NEXT}${request.file}`;
};

const formatStats = exports.formatStats = allStats => {
  const lines = [];

  Object.keys(allStats).forEach(category => {
    const stats = allStats[category];

    lines.push(`Stats by ${_chalk2.default.bold(_lodash2.default.startCase(category))}`);

    let totalRequests = 0;
    const totalTime = [0, 0];

    const data = [[_lodash2.default.startCase(category), 'Requests', 'Time', 'Time/Request', 'Description']];

    Object.keys(stats).forEach(item => {
      const stat = stats[item];

      totalRequests += stat.count || 0;

      const description = (0, _description2.default)(category, item);

      totalTime[0] += stat.time[0];
      totalTime[1] += stat.time[1];

      const avgTime = [stat.time[0] / stat.count, stat.time[1] / stat.count];

      data.push([item, stat.count || '-', (0, _prettyTime2.default)(stat.time), (0, _prettyTime2.default)(avgTime), description]);
    });

    data.push(['Total', totalRequests, (0, _prettyTime2.default)(totalTime), '', '']);

    lines.push((0, _table.table)(data));
  });

  return lines.join('\n\n');
};

function elipses(str, n) {
  if (str.length <= n - 3) {
    return str;
  }
  return `${str.substr(0, n - 1)}...`;
}

function elipsesLeft(str, n) {
  if (str.length <= n - 3) {
    return str;
  }
  return `...${str.substr(str.length - n - 1)}`;
}