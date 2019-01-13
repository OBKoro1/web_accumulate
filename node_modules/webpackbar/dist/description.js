'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDescription;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DB = {
  loader: {
    get: loader => _lodash2.default.startCase(loader)
  },
  ext: {
    get: ext => `${ext} files`,
    vue: 'Vue Single File components',
    js: 'JavaScript files',
    sass: 'SASS files',
    scss: 'SASS files',
    unknown: 'Unknown files'
  }
};

function getDescription(category, keyword) {
  if (!DB[category]) {
    return _lodash2.default.startCase(keyword);
  }

  if (DB[category][keyword]) {
    return DB[category][keyword];
  }

  if (DB[category].get) {
    return DB[category].get(keyword);
  }

  return '-';
}