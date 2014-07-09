rest-url
========

Makes a RESTful url from an endpoint and params

[![Build Status](https://travis-ci.org/greggman/rest-url.svg?branch=master)](https://travis-ci.org/greggman/rest-url)

An endpoint looks like `http://foo/:bar/:moo`
`:bar` and `:moo` will be replaced by matching params.
params not found in the endpoint will be added
on the end as query params.

In other words

    var restUrl = require('rest-url');
    restUrl.make("http://foo/:bar/:moo", {
       bar: "aaa",
       moo: "bbb",
       pow: "what",
       ya: "a b",
    });

returns

    http://foo/aaa/bbb?pow=what&ya=a%20b



