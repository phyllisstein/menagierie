/** @license React vundefined
 * react-unstable-cache.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';



if (process.env.NODE_ENV !== "production") {
  (function() {
'use strict';

var react = require('react');

// TODO: should there be a default cache?
var CacheContext = react.createContext(null);

function CacheImpl() {
  this.resources = new Map(); // TODO: cancellation token.
}

function createCache() {
  // $FlowFixMe
  return new CacheImpl();
}

function readCache() {
  // TODO: this doesn't subscribe.
  // But we really want load context anyway.
  var value = CacheContext._currentValue;

  if (value instanceof CacheImpl) {
    return value;
  }

  {
    {
      throw Error( "Could not read the cache." );
    }
  }
}

var CacheProvider = CacheContext.Provider;

exports.CacheProvider = CacheProvider;
exports.createCache = createCache;
exports.readCache = readCache;
  })();
}