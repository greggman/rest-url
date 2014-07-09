/*
 * Copyright 2014, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

"use strict";

var querystring = require('querystring');
var url         = require('url');

/**
 * Replaces :param in a url.
 *
 *     replaceRESTParams(
 *         "http://foo/:name/:repo",
 *         {
 *            name: "joe",
 *            repo: "blow",
 *         });
 *
 * returns
 *
 *     "http://foo/joe/blow"
 *
 *
 * @param {string} endpoint url
 * @param {object} params key/values
 * @returns {string} string with replaced params. Note: If a
 *        matching param does not exist no change is made for
 *        that param. The string will still contain :paramname
 *        for that param.
 */
var replaceRESTParams = (function() {
  var restRE = /\/:(\w+)/g;

  return function(endpoint, params) {
    return endpoint.replace(restRE, function(match, key) {
      var value = params[key];
      return "/" + ((value !== undefined) ? encodeURIComponent(value) : (":" + key));
    });
  };
}());

/**
 * Makes a RESTful url from an endpoint and params
 *
 * An endpoint looks like "http://foo/:bar/:moo"
 * :bar and :moo will be replaced by matching params.
 * params not found in the endpoint will be added
 * on the end as query params.
 *
 * In other words
 *
 *     makeRESTUrl("http://foo/:bar/:moo", {
 *        bar: "aaa",
 *        moo: "bbb",
 *        pow: "what",
 *        ya: "a b",
 *     });
 *
 * returns
 *
 *     http://foo/aaa/bbb?pow=what&ya=a%20b
 *
 * @param {string} endpoint the endpoint
 * @param {object} params key/value pairs
 * @param {string} the url
 */
var makeRESTUrl = (function() {
  var restRE = /\/:(\w+)/g;

  return function(endpoint, params) {
    // what params are in the endpoint
    var endpointParams = [];
    var result
    while (result = restRE.exec(endpoint)) {
      endpointParams.push(result[1]);
    }
    var query = {};
    Object.keys(params).forEach(function(key) {
      if (endpointParams.indexOf(key) < 0) {
        query[key] = params[key];
      }
    });
    var url = replaceRESTParams(endpoint, params);
    var queryStr = querystring.stringify(query);
    return url + (queryStr ? ('?' + queryStr) : '');
  };
}());

exports.make = makeRESTUrl;


