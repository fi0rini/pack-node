const typeCheck = require('type-check').typeCheck;
/**
 * Validate object against types
 **/
function _verifyOptions (o, v) {
  'use strict';
  if (typeof o !== 'object') throw new Error('missing options');
  if (typeof v !== 'object') throw new Error('missing validation object');

  if (Object.keys(o).length < Object.keys(v).length) throw new Error('Missing options. Expecting a total of ' + Object.keys(v).length + ' arguments and got ' + Object.keys(o).length);

  for (let key in o) {
    if (o.hasOwnProperty(key)) {
      if (!v[key] || typeCheck(v[key], o[key])) continue;
      else throw new Error('\nIncorrect option value for key: ' + key + '\nExpecting type: ' + v[key] + '\n');
    }
  }
}

module.exports = _verifyOptions;
