/*!
 * ask-for-github-auth <https://github.com/doowb/ask-for-github-auth>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';
var inquirer = require('inquirer');
var DataStore = require('data-store');
var Questions = require('question-cache');

var store = new DataStore('ask-for-github-auth.' + module.parent.name);
var questions = new Questions({inquirer: inquirer});
var ask = require('ask-once')(questions, store);

questions.set('github-auth.type', {
  type: 'list',
  choices: [
    {name: 'OAuth token', value: 'oauth'},
    {name: 'Username/Password', value: 'basic'}
  ],
  message: 'How would you like to authenticate with github?'
});

questions.set('github-auth.oauth', 'Token');
questions.set('github-auth.basic.username', {
  message: 'Username',
  default: 'undefined'
});
questions.set('github-auth.basic.password', {
  message: 'Password',
  type: 'password'
});

/**
 * Prompt a user for their github authentication credentials.
 * Save the answer so they're only asked once.
 *
 * ```js
 * ask(function (err, creds) {
 *   console.log(creds);
 *   //=>    {type: 'oauth', token: '123456'}
 *   //=> or {type: 'basic', username: 'doowb', password: 'password'}
 * });
 * ```
 *
 * @param  {Object} `options` Options to pass to [ask-once]
 * @param  {Function} `cb` Callback function returning either an error or authentication credentials
 * @api public
 */

function askForGithubAuth (options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  options = options || {};

  var creds = {};
  ask('github-auth.type', options, function (err, type) {
    if (err) return cb(err);

    creds.type = type;
    ask(['github-auth', type].join('.'), options, function (err, answer) {
      if (err) return cb(err);

      if (type === 'oauth') {
        creds.token = answer;
      } else {
        creds.username = answer.username;
        creds.password = answer.password;
      }
      cb(null, creds);
    });
  });
}

module.exports = askForGithubAuth;

