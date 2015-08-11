'use strict';

var assert = require('assert');

describe('ask-for-github-auth', function () {
  it('should export a function', function () {
    var ask = require('./');
    assert.equal(typeof ask, 'function');
  });
});
