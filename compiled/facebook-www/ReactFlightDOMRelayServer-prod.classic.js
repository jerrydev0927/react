/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 * @nolint
 * @preventMunge
 * @preserve-invariant-messages
 */

"use strict";
var JSResourceReferenceImpl = require("JSResourceReferenceImpl"),
  ReactFlightDOMRelayServerIntegration = require("ReactFlightDOMRelayServerIntegration"),
  React = require("react"),
  hasOwnProperty = Object.prototype.hasOwnProperty,
  isArrayImpl = Array.isArray;
function convertModelToJSON(request, parent, key, model) {
  parent = resolveModelToJSON(request, parent, key, model);
  if ("object" === typeof parent && null !== parent) {
    if (isArrayImpl(parent)) {
      var jsonArray = [];
      for (key = 0; key < parent.length; key++)
        jsonArray[key] = convertModelToJSON(
          request,
          parent,
          "" + key,
          parent[key]
        );
      return jsonArray;
    }
    key = {};
    for (jsonArray in parent)
      hasOwnProperty.call(parent, jsonArray) &&
        (key[jsonArray] = convertModelToJSON(
          request,
          parent,
          jsonArray,
          parent[jsonArray]
        ));
    return key;
  }
  return parent;
}
function writeChunkAndReturn(destination, chunk) {
  ReactFlightDOMRelayServerIntegration.emitRow(destination, chunk);
  return !0;
}
var REACT_ELEMENT_TYPE = Symbol.for("react.element"),
  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
  REACT_PROVIDER_TYPE = Symbol.for("react.provider"),
  REACT_SERVER_CONTEXT_TYPE = Symbol.for("react.server_context"),
  REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
  REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
  REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
  REACT_MEMO_TYPE = Symbol.for("react.memo"),
  REACT_LAZY_TYPE = Symbol.for("react.lazy"),
  REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = Symbol.for(
    "react.default_value"
  ),
  REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel"),
  MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
require("ReactFeatureFlags");
var currentActiveSnapshot = null;
function popToNearestCommonAncestor(prev, next) {
  if (prev !== next) {
    prev.context._currentValue = prev.parentValue;
    prev = prev.parent;
    var parentNext = next.parent;
    if (null === prev) {
      if (null !== parentNext)
        throw Error(
          "The stacks must reach the root at the same time. This is a bug in React."
        );
    } else {
      if (null === parentNext)
        throw Error(
          "The stacks must reach the root at the same time. This is a bug in React."
        );
      popToNearestCommonAncestor(prev, parentNext);
      next.context._currentValue = next.value;
    }
  }
}
function popAllPrevious(prev) {
  prev.context._currentValue = prev.parentValue;
  prev = prev.parent;
  null !== prev && popAllPrevious(prev);
}
function pushAllNext(next) {
  var parentNext = next.parent;
  null !== parentNext && pushAllNext(parentNext);
  next.context._currentValue = next.value;
}
function popPreviousToCommonLevel(prev, next) {
  prev.context._currentValue = prev.parentValue;
  prev = prev.parent;
  if (null === prev)
    throw Error(
      "The depth must equal at least at zero before reaching the root. This is a bug in React."
    );
  prev.depth === next.depth
    ? popToNearestCommonAncestor(prev, next)
    : popPreviousToCommonLevel(prev, next);
}
function popNextToCommonLevel(prev, next) {
  var parentNext = next.parent;
  if (null === parentNext)
    throw Error(
      "The depth must equal at least at zero before reaching the root. This is a bug in React."
    );
  prev.depth === parentNext.depth
    ? popToNearestCommonAncestor(prev, parentNext)
    : popNextToCommonLevel(prev, parentNext);
  next.context._currentValue = next.value;
}
function switchContext(newSnapshot) {
  var prev = currentActiveSnapshot;
  prev !== newSnapshot &&
    (null === prev
      ? pushAllNext(newSnapshot)
      : null === newSnapshot
      ? popAllPrevious(prev)
      : prev.depth === newSnapshot.depth
      ? popToNearestCommonAncestor(prev, newSnapshot)
      : prev.depth > newSnapshot.depth
      ? popPreviousToCommonLevel(prev, newSnapshot)
      : popNextToCommonLevel(prev, newSnapshot),
    (currentActiveSnapshot = newSnapshot));
}
function pushProvider(context, nextValue) {
  var prevValue = context._currentValue;
  context._currentValue = nextValue;
  var prevNode = currentActiveSnapshot;
  return (currentActiveSnapshot = context =
    {
      parent: prevNode,
      depth: null === prevNode ? 0 : prevNode.depth + 1,
      context: context,
      parentValue: prevValue,
      value: nextValue
    });
}
var SuspenseException = Error(
  "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`"
);
function noop() {}
function trackUsedThenable(thenableState, thenable, index) {
  index = thenableState[index];
  void 0 === index
    ? thenableState.push(thenable)
    : index !== thenable && (thenable.then(noop, noop), (thenable = index));
  switch (thenable.status) {
    case "fulfilled":
      return thenable.value;
    case "rejected":
      throw thenable.reason;
    default:
      if ("string" !== typeof thenable.status)
        switch (
          ((thenableState = thenable),
          (thenableState.status = "pending"),
          thenableState.then(
            function (fulfilledValue) {
              if ("pending" === thenable.status) {
                var fulfilledThenable = thenable;
                fulfilledThenable.status = "fulfilled";
                fulfilledThenable.value = fulfilledValue;
              }
            },
            function (error) {
              if ("pending" === thenable.status) {
                var rejectedThenable = thenable;
                rejectedThenable.status = "rejected";
                rejectedThenable.reason = error;
              }
            }
          ),
          thenable.status)
        ) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
      suspendedThenable = thenable;
      throw SuspenseException;
  }
}
var suspendedThenable = null;
function getSuspendedThenable() {
  if (null === suspendedThenable)
    throw Error(
      "Expected a suspended thenable. This is a bug in React. Please file an issue."
    );
  var thenable = suspendedThenable;
  suspendedThenable = null;
  return thenable;
}
var currentRequest = null,
  thenableIndexCounter = 0,
  thenableState = null;
function getThenableStateAfterSuspending() {
  var state = thenableState;
  thenableState = null;
  return state;
}
function readContext(context) {
  return context._currentValue;
}
var HooksDispatcher = {
  useMemo: function (nextCreate) {
    return nextCreate();
  },
  useCallback: function (callback) {
    return callback;
  },
  useDebugValue: function () {},
  useDeferredValue: unsupportedHook,
  useTransition: unsupportedHook,
  readContext: readContext,
  useContext: readContext,
  useReducer: unsupportedHook,
  useRef: unsupportedHook,
  useState: unsupportedHook,
  useInsertionEffect: unsupportedHook,
  useLayoutEffect: unsupportedHook,
  useImperativeHandle: unsupportedHook,
  useEffect: unsupportedHook,
  useId: useId,
  useMutableSource: unsupportedHook,
  useSyncExternalStore: unsupportedHook,
  useCacheRefresh: function () {
    return unsupportedRefresh;
  },
  useMemoCache: function (size) {
    for (var data = Array(size), i = 0; i < size; i++)
      data[i] = REACT_MEMO_CACHE_SENTINEL;
    return data;
  },
  use: use
};
function unsupportedHook() {
  throw Error("This Hook is not supported in Server Components.");
}
function unsupportedRefresh() {
  throw Error("Refreshing the cache is not supported in Server Components.");
}
function useId() {
  if (null === currentRequest)
    throw Error("useId can only be used while React is rendering");
  var id = currentRequest.identifierCount++;
  return ":" + currentRequest.identifierPrefix + "S" + id.toString(32) + ":";
}
function use(usable) {
  if (
    (null !== usable && "object" === typeof usable) ||
    "function" === typeof usable
  ) {
    if ("function" === typeof usable.then) {
      var index = thenableIndexCounter;
      thenableIndexCounter += 1;
      null === thenableState && (thenableState = []);
      return trackUsedThenable(thenableState, usable, index);
    }
    if (usable.$$typeof === REACT_SERVER_CONTEXT_TYPE)
      return usable._currentValue;
  }
  throw Error("An unsupported type was passed to use(): " + String(usable));
}
function createSignal() {
  return new AbortController().signal;
}
var DefaultCacheDispatcher = {
    getCacheSignal: function () {
      var cache = currentCache ? currentCache : new Map(),
        entry = cache.get(createSignal);
      void 0 === entry &&
        ((entry = createSignal()), cache.set(createSignal, entry));
      return entry;
    },
    getCacheForType: function (resourceType) {
      var cache = currentCache ? currentCache : new Map(),
        entry = cache.get(resourceType);
      void 0 === entry &&
        ((entry = resourceType()), cache.set(resourceType, entry));
      return entry;
    }
  },
  currentCache = null;
function objectName(object) {
  return Object.prototype.toString
    .call(object)
    .replace(/^\[object (.*)\]$/, function (m, p0) {
      return p0;
    });
}
function describeValueForErrorMessage(value) {
  switch (typeof value) {
    case "string":
      return JSON.stringify(
        10 >= value.length ? value : value.substr(0, 10) + "..."
      );
    case "object":
      if (isArrayImpl(value)) return "[...]";
      value = objectName(value);
      return "Object" === value ? "{...}" : value;
    case "function":
      return "function";
    default:
      return String(value);
  }
}
function describeElementType(type) {
  if ("string" === typeof type) return type;
  switch (type) {
    case REACT_SUSPENSE_TYPE:
      return "Suspense";
    case REACT_SUSPENSE_LIST_TYPE:
      return "SuspenseList";
  }
  if ("object" === typeof type)
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        return describeElementType(type.render);
      case REACT_MEMO_TYPE:
        return describeElementType(type.type);
      case REACT_LAZY_TYPE:
        var payload = type._payload;
        type = type._init;
        try {
          return describeElementType(type(payload));
        } catch (x) {}
    }
  return "";
}
function describeObjectForErrorMessage(objectOrArray, expandedName) {
  var objKind = objectName(objectOrArray);
  if ("Object" !== objKind && "Array" !== objKind) return objKind;
  objKind = -1;
  var length = 0;
  if (isArrayImpl(objectOrArray)) {
    var str = "[";
    for (var i = 0; i < objectOrArray.length; i++) {
      0 < i && (str += ", ");
      var value = objectOrArray[i];
      value =
        "object" === typeof value && null !== value
          ? describeObjectForErrorMessage(value)
          : describeValueForErrorMessage(value);
      "" + i === expandedName
        ? ((objKind = str.length), (length = value.length), (str += value))
        : (str =
            10 > value.length && 40 > str.length + value.length
              ? str + value
              : str + "...");
    }
    str += "]";
  } else if (objectOrArray.$$typeof === REACT_ELEMENT_TYPE)
    str = "<" + describeElementType(objectOrArray.type) + "/>";
  else {
    str = "{";
    i = Object.keys(objectOrArray);
    for (value = 0; value < i.length; value++) {
      0 < value && (str += ", ");
      var name = i[value],
        encodedKey = JSON.stringify(name);
      str += ('"' + name + '"' === encodedKey ? name : encodedKey) + ": ";
      encodedKey = objectOrArray[name];
      encodedKey =
        "object" === typeof encodedKey && null !== encodedKey
          ? describeObjectForErrorMessage(encodedKey)
          : describeValueForErrorMessage(encodedKey);
      name === expandedName
        ? ((objKind = str.length),
          (length = encodedKey.length),
          (str += encodedKey))
        : (str =
            10 > encodedKey.length && 40 > str.length + encodedKey.length
              ? str + encodedKey
              : str + "...");
    }
    str += "}";
  }
  return void 0 === expandedName
    ? str
    : -1 < objKind && 0 < length
    ? ((objectOrArray = " ".repeat(objKind) + "^".repeat(length)),
      "\n  " + str + "\n  " + objectOrArray)
    : "\n  " + str;
}
var ReactSharedInternals =
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  ContextRegistry = ReactSharedInternals.ContextRegistry,
  ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher,
  ReactCurrentCache = ReactSharedInternals.ReactCurrentCache;
function defaultErrorHandler(error) {
  console.error(error);
}
function createRequest(
  model,
  bundlerConfig,
  onError,
  context,
  identifierPrefix
) {
  if (
    null !== ReactCurrentCache.current &&
    ReactCurrentCache.current !== DefaultCacheDispatcher
  )
    throw Error("Currently React only supports one RSC renderer at a time.");
  ReactCurrentCache.current = DefaultCacheDispatcher;
  var abortSet = new Set(),
    pingedTasks = [],
    request = {
      status: 0,
      fatalError: null,
      destination: null,
      bundlerConfig: bundlerConfig,
      cache: new Map(),
      nextChunkId: 0,
      pendingChunks: 0,
      abortableTasks: abortSet,
      pingedTasks: pingedTasks,
      completedImportChunks: [],
      completedJSONChunks: [],
      completedErrorChunks: [],
      writtenSymbols: new Map(),
      writtenClientReferences: new Map(),
      writtenServerReferences: new Map(),
      writtenProviders: new Map(),
      identifierPrefix: identifierPrefix || "",
      identifierCount: 1,
      onError: void 0 === onError ? defaultErrorHandler : onError,
      toJSON: function (key, value) {
        return resolveModelToJSON(request, this, key, value);
      }
    };
  request.pendingChunks++;
  bundlerConfig = importServerContexts(context);
  model = createTask(request, model, bundlerConfig, abortSet);
  pingedTasks.push(model);
  return request;
}
var POP = {};
function serializeThenable(request, thenable) {
  request.pendingChunks++;
  var newTask = createTask(
    request,
    null,
    currentActiveSnapshot,
    request.abortableTasks
  );
  switch (thenable.status) {
    case "fulfilled":
      return (
        (newTask.model = thenable.value), pingTask(request, newTask), newTask.id
      );
    case "rejected":
      var digest = logRecoverableError(request, thenable.reason);
      emitErrorChunkProd(request, newTask.id, digest);
      return newTask.id;
    default:
      "string" !== typeof thenable.status &&
        ((thenable.status = "pending"),
        thenable.then(
          function (fulfilledValue) {
            "pending" === thenable.status &&
              ((thenable.status = "fulfilled"),
              (thenable.value = fulfilledValue));
          },
          function (error) {
            "pending" === thenable.status &&
              ((thenable.status = "rejected"), (thenable.reason = error));
          }
        ));
  }
  thenable.then(
    function (value) {
      newTask.model = value;
      pingTask(request, newTask);
    },
    function (reason) {
      newTask.status = 4;
      reason = logRecoverableError(request, reason);
      emitErrorChunkProd(request, newTask.id, reason);
      null !== request.destination &&
        flushCompletedChunks(request, request.destination);
    }
  );
  return newTask.id;
}
function readThenable(thenable) {
  if ("fulfilled" === thenable.status) return thenable.value;
  if ("rejected" === thenable.status) throw thenable.reason;
  throw thenable;
}
function createLazyWrapperAroundWakeable(wakeable) {
  switch (wakeable.status) {
    case "fulfilled":
    case "rejected":
      break;
    default:
      "string" !== typeof wakeable.status &&
        ((wakeable.status = "pending"),
        wakeable.then(
          function (fulfilledValue) {
            "pending" === wakeable.status &&
              ((wakeable.status = "fulfilled"),
              (wakeable.value = fulfilledValue));
          },
          function (error) {
            "pending" === wakeable.status &&
              ((wakeable.status = "rejected"), (wakeable.reason = error));
          }
        ));
  }
  return { $$typeof: REACT_LAZY_TYPE, _payload: wakeable, _init: readThenable };
}
function attemptResolveElement(
  request,
  type,
  key,
  ref,
  props,
  prevThenableState
) {
  if (null !== ref && void 0 !== ref)
    throw Error(
      "Refs cannot be used in Server Components, nor passed to Client Components."
    );
  if ("function" === typeof type) {
    if (type instanceof JSResourceReferenceImpl)
      return [REACT_ELEMENT_TYPE, type, key, props];
    thenableIndexCounter = 0;
    thenableState = prevThenableState;
    props = type(props);
    return "object" === typeof props &&
      null !== props &&
      "function" === typeof props.then
      ? "fulfilled" === props.status
        ? props.value
        : createLazyWrapperAroundWakeable(props)
      : props;
  }
  if ("string" === typeof type) return [REACT_ELEMENT_TYPE, type, key, props];
  if ("symbol" === typeof type)
    return type === REACT_FRAGMENT_TYPE
      ? props.children
      : [REACT_ELEMENT_TYPE, type, key, props];
  if (null != type && "object" === typeof type) {
    if (type instanceof JSResourceReferenceImpl)
      return [REACT_ELEMENT_TYPE, type, key, props];
    switch (type.$$typeof) {
      case REACT_LAZY_TYPE:
        var init = type._init;
        type = init(type._payload);
        return attemptResolveElement(
          request,
          type,
          key,
          ref,
          props,
          prevThenableState
        );
      case REACT_FORWARD_REF_TYPE:
        return (
          (request = type.render),
          (thenableIndexCounter = 0),
          (thenableState = prevThenableState),
          request(props, void 0)
        );
      case REACT_MEMO_TYPE:
        return attemptResolveElement(
          request,
          type.type,
          key,
          ref,
          props,
          prevThenableState
        );
      case REACT_PROVIDER_TYPE:
        return (
          pushProvider(type._context, props.value),
          [
            REACT_ELEMENT_TYPE,
            type,
            key,
            { value: props.value, children: props.children, __pop: POP }
          ]
        );
    }
  }
  throw Error(
    "Unsupported Server Component type: " + describeValueForErrorMessage(type)
  );
}
function pingTask(request, task) {
  var pingedTasks = request.pingedTasks;
  pingedTasks.push(task);
  1 === pingedTasks.length && performWork(request);
}
function createTask(request, model, context, abortSet) {
  var task = {
    id: request.nextChunkId++,
    status: 0,
    model: model,
    context: context,
    ping: function () {
      return pingTask(request, task);
    },
    thenableState: null
  };
  abortSet.add(task);
  return task;
}
function serializeClientReference(request, parent, key, clientReference) {
  var writtenClientReferences = request.writtenClientReferences,
    existingId = writtenClientReferences.get(clientReference);
  if (void 0 !== existingId)
    return parent[0] === REACT_ELEMENT_TYPE && "1" === key
      ? "$L" + existingId.toString(16)
      : "$" + existingId.toString(16);
  try {
    var clientReferenceMetadata =
      ReactFlightDOMRelayServerIntegration.resolveClientReferenceMetadata(
        request.bundlerConfig,
        clientReference
      );
    request.pendingChunks++;
    var importId = request.nextChunkId++;
    request.completedImportChunks.push([
      "I",
      importId,
      clientReferenceMetadata
    ]);
    writtenClientReferences.set(clientReference, importId);
    return parent[0] === REACT_ELEMENT_TYPE && "1" === key
      ? "$L" + importId.toString(16)
      : "$" + importId.toString(16);
  } catch (x) {
    return (
      request.pendingChunks++,
      (parent = request.nextChunkId++),
      (key = logRecoverableError(request, x)),
      emitErrorChunkProd(request, parent, key),
      "$" + parent.toString(16)
    );
  }
}
function resolveModelToJSON(request, parent, key, value) {
  switch (value) {
    case REACT_ELEMENT_TYPE:
      return "$";
  }
  for (
    ;
    "object" === typeof value &&
    null !== value &&
    (value.$$typeof === REACT_ELEMENT_TYPE ||
      value.$$typeof === REACT_LAZY_TYPE);

  )
    try {
      switch (value.$$typeof) {
        case REACT_ELEMENT_TYPE:
          var element = value;
          value = attemptResolveElement(
            request,
            element.type,
            element.key,
            element.ref,
            element.props,
            null
          );
          break;
        case REACT_LAZY_TYPE:
          var init = value._init;
          value = init(value._payload);
      }
    } catch (thrownValue) {
      key =
        thrownValue === SuspenseException
          ? getSuspendedThenable()
          : thrownValue;
      if (
        "object" === typeof key &&
        null !== key &&
        "function" === typeof key.then
      )
        return (
          request.pendingChunks++,
          (request = createTask(
            request,
            value,
            currentActiveSnapshot,
            request.abortableTasks
          )),
          (value = request.ping),
          key.then(value, value),
          (request.thenableState = getThenableStateAfterSuspending()),
          "$L" + request.id.toString(16)
        );
      request.pendingChunks++;
      value = request.nextChunkId++;
      key = logRecoverableError(request, key);
      emitErrorChunkProd(request, value, key);
      return "$L" + value.toString(16);
    }
  if (null === value) return null;
  if ("object" === typeof value) {
    if (value instanceof JSResourceReferenceImpl)
      return serializeClientReference(request, parent, key, value);
    if ("function" === typeof value.then)
      return "$@" + serializeThenable(request, value).toString(16);
    if (value.$$typeof === REACT_PROVIDER_TYPE)
      return (
        (value = value._context._globalName),
        (parent = request.writtenProviders),
        (key = parent.get(key)),
        void 0 === key &&
          (request.pendingChunks++,
          (key = request.nextChunkId++),
          parent.set(value, key),
          request.completedJSONChunks.push(["O", key, "$P" + value])),
        "$" + key.toString(16)
      );
    if (value === POP) {
      request = currentActiveSnapshot;
      if (null === request)
        throw Error(
          "Tried to pop a Context at the root of the app. This is a bug in React."
        );
      value = request.parentValue;
      request.context._currentValue =
        value === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED
          ? request.context._defaultValue
          : value;
      currentActiveSnapshot = request.parent;
      return;
    }
    return !isArrayImpl(value) &&
      (null === value || "object" !== typeof value
        ? (request = null)
        : ((request =
            (MAYBE_ITERATOR_SYMBOL && value[MAYBE_ITERATOR_SYMBOL]) ||
            value["@@iterator"]),
          (request = "function" === typeof request ? request : null)),
      request)
      ? Array.from(value)
      : value;
  }
  if ("string" === typeof value)
    return (request = "$" === value[0] ? "$" + value : value), request;
  if ("boolean" === typeof value || "number" === typeof value) return value;
  if ("undefined" === typeof value) return "$undefined";
  if ("function" === typeof value) {
    if (value instanceof JSResourceReferenceImpl)
      return serializeClientReference(request, parent, key, value);
    if (/^on[A-Z]/.test(key))
      throw Error(
        "Event handlers cannot be passed to Client Component props." +
          describeObjectForErrorMessage(parent, key) +
          "\nIf you need interactivity, consider converting part of this to a Client Component."
      );
    throw Error(
      'Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server".' +
        describeObjectForErrorMessage(parent, key)
    );
  }
  if ("symbol" === typeof value) {
    element = request.writtenSymbols;
    init = element.get(value);
    if (void 0 !== init) return "$" + init.toString(16);
    init = value.description;
    if (Symbol.for(init) !== value)
      throw Error(
        "Only global symbols received from Symbol.for(...) can be passed to Client Components. The symbol Symbol.for(" +
          (value.description + ") cannot be found among global symbols.") +
          describeObjectForErrorMessage(parent, key)
      );
    request.pendingChunks++;
    key = request.nextChunkId++;
    request.completedImportChunks.push(["O", key, "$S" + init]);
    element.set(value, key);
    return "$" + key.toString(16);
  }
  if ("bigint" === typeof value) return "$n" + value.toString(10);
  throw Error(
    "Type " +
      typeof value +
      " is not supported in Client Component props." +
      describeObjectForErrorMessage(parent, key)
  );
}
function logRecoverableError(request, error) {
  request = request.onError;
  error = request(error);
  if (null != error && "string" !== typeof error)
    throw Error(
      'onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' +
        typeof error +
        '" instead'
    );
  return error || "";
}
function fatalError(request, error) {
  null !== request.destination
    ? ((request.status = 2),
      ReactFlightDOMRelayServerIntegration.close(request.destination))
    : ((request.status = 1), (request.fatalError = error));
}
function emitErrorChunkProd(request, id, digest) {
  request.completedErrorChunks.push(["E", id, { digest: digest }]);
}
function performWork(request$jscomp$0) {
  var prevDispatcher = ReactCurrentDispatcher.current,
    prevCache = currentCache;
  ReactCurrentDispatcher.current = HooksDispatcher;
  currentCache = request$jscomp$0.cache;
  currentRequest = request$jscomp$0;
  try {
    var pingedTasks = request$jscomp$0.pingedTasks;
    request$jscomp$0.pingedTasks = [];
    for (var i = 0; i < pingedTasks.length; i++) {
      var task = pingedTasks[i];
      var request = request$jscomp$0;
      if (0 === task.status) {
        switchContext(task.context);
        try {
          var value = task.model;
          if (
            "object" === typeof value &&
            null !== value &&
            value.$$typeof === REACT_ELEMENT_TYPE
          ) {
            var element = value,
              prevThenableState = task.thenableState;
            task.model = value;
            value = attemptResolveElement(
              request,
              element.type,
              element.key,
              element.ref,
              element.props,
              prevThenableState
            );
            for (
              task.thenableState = null;
              "object" === typeof value &&
              null !== value &&
              value.$$typeof === REACT_ELEMENT_TYPE;

            )
              (element = value),
                (task.model = value),
                (value = attemptResolveElement(
                  request,
                  element.type,
                  element.key,
                  element.ref,
                  element.props,
                  null
                ));
          }
          var id = task.id,
            json = convertModelToJSON(request, {}, "", value);
          request.completedJSONChunks.push(["O", id, json]);
          request.abortableTasks.delete(task);
          task.status = 1;
        } catch (thrownValue) {
          var x =
            thrownValue === SuspenseException
              ? getSuspendedThenable()
              : thrownValue;
          if (
            "object" === typeof x &&
            null !== x &&
            "function" === typeof x.then
          ) {
            var ping = task.ping;
            x.then(ping, ping);
            task.thenableState = getThenableStateAfterSuspending();
          } else {
            request.abortableTasks.delete(task);
            task.status = 4;
            var digest = logRecoverableError(request, x);
            emitErrorChunkProd(request, task.id, digest);
          }
        }
      }
    }
    null !== request$jscomp$0.destination &&
      flushCompletedChunks(request$jscomp$0, request$jscomp$0.destination);
  } catch (error) {
    logRecoverableError(request$jscomp$0, error),
      fatalError(request$jscomp$0, error);
  } finally {
    (ReactCurrentDispatcher.current = prevDispatcher),
      (currentCache = prevCache),
      (currentRequest = null);
  }
}
function flushCompletedChunks(request, destination) {
  for (
    var importsChunks = request.completedImportChunks, i = 0;
    i < importsChunks.length;
    i++
  )
    request.pendingChunks--, writeChunkAndReturn(destination, importsChunks[i]);
  importsChunks.splice(0, i);
  importsChunks = request.completedJSONChunks;
  for (i = 0; i < importsChunks.length; i++)
    request.pendingChunks--, writeChunkAndReturn(destination, importsChunks[i]);
  importsChunks.splice(0, i);
  importsChunks = request.completedErrorChunks;
  for (i = 0; i < importsChunks.length; i++)
    request.pendingChunks--, writeChunkAndReturn(destination, importsChunks[i]);
  importsChunks.splice(0, i);
  0 === request.pendingChunks &&
    ReactFlightDOMRelayServerIntegration.close(destination);
}
function importServerContexts(contexts) {
  if (contexts) {
    var prevContext = currentActiveSnapshot;
    switchContext(null);
    for (var i = 0; i < contexts.length; i++) {
      var _contexts$i = contexts[i],
        name = _contexts$i[0];
      _contexts$i = _contexts$i[1];
      ContextRegistry[name] ||
        (ContextRegistry[name] = React.createServerContext(
          name,
          REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED
        ));
      pushProvider(ContextRegistry[name], _contexts$i);
    }
    contexts = currentActiveSnapshot;
    switchContext(prevContext);
    return contexts;
  }
  return null;
}
exports.render = function (model, destination, config, options) {
  model = createRequest(
    model,
    config,
    options ? options.onError : void 0,
    void 0,
    options ? options.identifierPrefix : void 0
  );
  performWork(model);
  if (1 === model.status)
    (model.status = 2), ReactFlightDOMRelayServerIntegration.close(destination);
  else if (2 !== model.status && null === model.destination) {
    model.destination = destination;
    try {
      flushCompletedChunks(model, destination);
    } catch (error) {
      logRecoverableError(model, error), fatalError(model, error);
    }
  }
};
