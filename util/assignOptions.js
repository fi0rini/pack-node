function _assignOptions (a, b) {
  'use strict';
  if (typeof a !== 'object' || typeof b !== 'object') throw new Error('missing options');

  for (let key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }
}

module.exports = _assignOptions;
