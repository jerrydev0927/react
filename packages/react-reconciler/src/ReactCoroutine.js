/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use strict';

import type {
  ReactCoroutine,
  ReactNodeList,
  ReactYield,
} from 'shared/ReactTypes';

// The Symbol used to tag the special React types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var REACT_COROUTINE_TYPE;
var REACT_YIELD_TYPE;
if (typeof Symbol === 'function' && Symbol.for) {
  REACT_COROUTINE_TYPE = Symbol.for('react.coroutine');
  REACT_YIELD_TYPE = Symbol.for('react.yield');
} else {
  REACT_COROUTINE_TYPE = 0xeac8;
  REACT_YIELD_TYPE = 0xeac9;
}

type CoroutineHandler<T> = (props: T, yields: Array<mixed>) => ReactNodeList;

exports.createCoroutine = function<T>(
  children: mixed,
  handler: CoroutineHandler<T>,
  props: T,
  key: ?string = null,
): ReactCoroutine {
  var coroutine = {
    // This tag allow us to uniquely identify this as a React Coroutine
    $$typeof: REACT_COROUTINE_TYPE,
    key: key == null ? null : '' + key,
    children: children,
    handler: handler,
    props: props,
  };

  if (__DEV__) {
    // TODO: Add _store property for marking this as validated.
    if (Object.freeze) {
      Object.freeze(coroutine.props);
      Object.freeze(coroutine);
    }
  }

  return coroutine;
};

exports.createYield = function(value: mixed): ReactYield {
  var yieldNode = {
    // This tag allow us to uniquely identify this as a React Yield
    $$typeof: REACT_YIELD_TYPE,
    value: value,
  };

  if (__DEV__) {
    // TODO: Add _store property for marking this as validated.
    if (Object.freeze) {
      Object.freeze(yieldNode);
    }
  }

  return yieldNode;
};

/**
 * Verifies the object is a coroutine object.
 */
exports.isCoroutine = function(object: mixed): boolean {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_COROUTINE_TYPE
  );
};

/**
 * Verifies the object is a yield object.
 */
exports.isYield = function(object: mixed): boolean {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_YIELD_TYPE
  );
};

exports.REACT_YIELD_TYPE = REACT_YIELD_TYPE;
exports.REACT_COROUTINE_TYPE = REACT_COROUTINE_TYPE;
