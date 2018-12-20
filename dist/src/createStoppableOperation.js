"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStoppableOperation = void 0;

var _cancellation = require("./cancellation.js");

var _memoizeOnce = require("./memoizeOnce.js");

const createStoppableOperation = ({
  cancellationToken = (0, _cancellation.createCancellationToken)(),
  start,
  stop
}) => {
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
//# sourceMappingURL=./createStoppableOperation.js.map