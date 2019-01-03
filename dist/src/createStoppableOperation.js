"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStoppableOperation = void 0;

var _cancellation = require("./cancellation.js");

var _memoizeOnce = require("./memoizeOnce.js");

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const createStoppableOperation = (_ref) => {
  let {
    cancellationToken = (0, _cancellation.createCancellationToken)(),
    start,
    stop
  } = _ref,
      rest = _objectWithoutProperties(_ref, ["cancellationToken", "start", "stop"]);

  if (typeof stop !== "function") throw new TypeError(`createStoppableOperation expect a stop function. got ${stop}`);
  ensureExactParameters(rest);
  cancellationToken.throwIfRequested();
  const promise = start();
  const cancelPromise = new Promise((resolve, reject) => {
    const cancelRegistration = cancellationToken.register(cancelError => {
      cancelRegistration.unregister();
      reject(cancelError);
    });
    promise.then(cancelRegistration.unregister);
  });
  const operationPromise = Promise.race([promise, cancelPromise]);
  const stopInternal = (0, _memoizeOnce.memoizeOnce)(async reason => {
    const value = await promise;
    return stop(value, reason);
  });
  cancellationToken.register(stopInternal);
  operationPromise.stop = stopInternal;
  return operationPromise;
};

exports.createStoppableOperation = createStoppableOperation;

const ensureExactParameters = extraParameters => {
  const extraParamNames = Object.keys(extraParameters);
  if (extraParamNames.length) throw new Error(`createOperation expect only cancellationToken, start. Got ${extraParamNames}`);
};
//# sourceMappingURL=./createStoppableOperation.js.map