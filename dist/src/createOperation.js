"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOperation = void 0;

var _cancellation = require("./cancellation.js");

const createOperation = ({
  cancellationToken = (0, _cancellation.createCancellationToken)(),
  start
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
  return operationPromise;
};

exports.createOperation = createOperation;
//# sourceMappingURL=./createOperation.js.map