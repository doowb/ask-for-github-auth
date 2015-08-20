/*!
 * ask-for-github-auth <https://github.com/doowb/ask-for-github-auth>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';


var questions, ask;

function loadQuestions (store) {
  var path = require('path');
  var inquirer = require('inquirer');
  var username = require('git-username');
  var Questions = require('question-cache');

  questions = new Questions({inquirer: inquirer});
  ask = require('ask-once')(questions, store);

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
    default: username()
  });
  questions.set('github-auth.basic.password', {
    message: 'Password',
    type: 'password'
  });
}

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
 * @param  {Object} `options` Options to pass to [ask-once][]
 * @param  {String} `options.store` a [data-store][] instance or name that can be passed to [ask-once][]
 * @param  {Function} `cb` Callback function returning either an error or authentication credentials
 * @api public
 */

function askForGithubAuth (options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  options = options || {};
  options.store = options.store || 'default';
  if (typeof options.store === 'string') {
    options.store = 'for-github-auth.' + options.store;
  }
  loadQuestions(options.store);

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

