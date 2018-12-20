"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAbortableOperation = void 0;

var _cancellation = require("./cancellation.js");

var _memoizeOnce = require("./memoizeOnce.js");

const createAbortableOperation = ({
  cancellationToken = (0, _cancellation.createCancellationToken)(),
  start,
  abort
}) => {
  if (typeof abort !== "function") throw new TypeError(`createAbortableOperation expect an abort function. got ${abort}`);
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
  const abortInternal = (0, _memoizeOnce.memoizeOnce)(abort);
  const abortRegistration = cancellationToken.register(abortInternal);
  promise.then(abortRegistration.unregister);
  operationPromise.abort = abortInternal;
  return operationPromise;
};

exports.createAbortableOperation = createAbortableOperation;
//# sourceMappingURL=./createAbortableOperation.js.map