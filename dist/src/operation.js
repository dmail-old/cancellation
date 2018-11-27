"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOperation = void 0;

var _cancellation = require("./cancellation.js");

const createOperation = ({
  cancellationToken = (0, _cancellation.createCancellationToken)(),
  stop,
  abort,
  promise
}) => {
  // we must have either abort or stop but not both and not none
  let abortOrStopRequested = false;
  let abortOrStopResolve;
  const abortOrStopPromise = new Promise(resolve => {
    abortOrStopResolve = resolve;
  });

  const abortOrStop = reason => {
    if (abortOrStopRequested) return abortOrStopPromise;
    abortOrStopRequested = true;
    abortOrStopResolve(abort ? abort(reason) : promise.then(() => stop(reason)));
    return abortOrStopPromise;
  };

  const cancellationRequestedPromise = new Promise((resolve, reject) => {
    const rejectRegistration = cancellationToken.register(reason => {
      // unregister immediatly so it won't appear in cancel() values
      rejectRegistration.unregister();
      reject((0, _cancellation.createCancelError)(reason));
    });
    promise.then(rejectRegistration.unregister, reject);

    if (abort) {
      const abortRegistration = cancellationToken.register(abortOrStop);
      promise.then(abortRegistration.unregister, reject);
    } else if (stop) {
      cancellationToken.register(abortOrStop);
    }
  });
  const operationPromise = Promise.race([promise, cancellationRequestedPromise]);
  operationPromise[stop ? "stop" : "abort"] = abortOrStop;
  return operationPromise;
};

exports.createOperation = createOperation;
//# sourceMappingURL=operation.js.map