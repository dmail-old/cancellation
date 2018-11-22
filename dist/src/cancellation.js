"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPendingIfRequested = exports.toRejectedIfRequested = exports.createCancelError = exports.createCancellationToken = exports.cancellationTokenCompose = exports.createCancellationSource = void 0;

var _arrayHelper = require("./arrayHelper.js");

// https://github.com/tc39/proposal-cancellation/tree/master/stage0
const createCancellationSource = () => {
  let canceled = false;
  let callbacks = [];
  let requestedResolve;
  let cancelPromise;
  const requestedPromise = new Promise(resolve => {
    requestedResolve = resolve;
  });

  const toRequestedPromise = () => requestedPromise;

  const cancel = reason => {
    if (canceled) {
      return cancelPromise;
    }

    canceled = true;
    requestedResolve(reason);
    const values = [];
    cancelPromise = callbacks.reduce((previous, callback, index) => {
      return previous.then(() => callback(reason)).then(value => {
        values[index] = value;
      });
    }, Promise.resolve()).then(() => values);
    return cancelPromise;
  };

  const register = callback => {
    const index = callbacks.indexOf(callback);

    if (index > -1) {
      return () => {
        callbacks = (0, _arrayHelper.arrayWithout)(callbacks, callback);
      };
    }

    callbacks = [callback, ...callbacks];
    return () => {
      callbacks = (0, _arrayHelper.arrayWithout)(callbacks, callback);
    };
  };

  return {
    token: {
      toRequestedPromise,
      register
    },
    cancel
  };
};

exports.createCancellationSource = createCancellationSource;

const cancellationTokenCompose = (...tokens) => {
  const register = callback => {
    const unregisters = tokens.map(token => token.register(callback));
    return () => unregisters.forEach(unregister => unregister());
  };

  const toRequestedPromise = () => {
    return Promise.race([tokens.map(token => token.toRequestedPromise())]);
  };

  return {
    toRequestedPromise,
    register
  };
};

exports.cancellationTokenCompose = cancellationTokenCompose;

const createCancellationToken = () => {
  return {
    toRequestedPromise: () => new Promise(() => {}),
    register: () => () => {}
  };
};

exports.createCancellationToken = createCancellationToken;
const pendingFlag = {};

const cancellationTokenToPromiseIfRequested = ({
  toRequestedPromise
}, promises, requestedToPromise) => {
  if (promises.length === 0) {
    return Promise.race([toRequestedPromise(), pendingFlag]).then(value => {
      return value === pendingFlag ? undefined : requestedToPromise(value);
    });
  }

  return Promise.race([...promises, toRequestedPromise().then(requestedToPromise)]);
};

const createCancelError = reason => {
  const cancelError = new Error(`canceled because ${reason}`);
  cancelError.name = "CANCEL_ERROR";
  cancelError.reason = reason;
  return cancelError;
};

exports.createCancelError = createCancelError;

const toRejectedPromise = reason => Promise.reject(createCancelError(reason));

const toRejectedIfRequested = (cancellationToken, ...promises) => {
  return cancellationTokenToPromiseIfRequested(cancellationToken, promises, toRejectedPromise);
}; // It may lead to memory leak but it has to be tested


exports.toRejectedIfRequested = toRejectedIfRequested;

const toPendingPromise = () => new Promise(() => {});

const toPendingIfRequested = (cancellationToken, ...promises) => {
  return cancellationTokenToPromiseIfRequested(cancellationToken, promises, toPendingPromise);
}; // export const cancelllationTokenCanceled = {
//   register: () => () => {},
//   isRequested: () => true,
//   toPromise: () => cancellationToPromise(),
// }


exports.toPendingIfRequested = toPendingIfRequested;
//# sourceMappingURL=cancellation.js.map