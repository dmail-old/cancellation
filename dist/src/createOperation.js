"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOperation = void 0;

var _cancellation = require("./cancellation.js");

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const createOperation = (_ref) => {
  let {
    cancellationToken = (0, _cancellation.createCancellationToken)(),
    start
  } = _ref,
      rest = _objectWithoutProperties(_ref, ["cancellationToken", "start"]);

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
  return operationPromise;
};

exports.createOperation = createOperation;

const ensureExactParameters = extraParameters => {
  const extraParamNames = Object.keys(extraParameters);
  if (extraParamNames.length) throw new Error(`createOperation expect only cancellationToken, start. Got ${extraParamNames}`);
};
//# sourceMappingURL=./createOperation.js.map