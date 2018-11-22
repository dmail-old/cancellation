"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trackOperation = exports.createCancellationToken = exports.cancellationTokenCompose = exports.createCancellationSource = exports.isCancelError = exports.createCancelError = void 0;

var _arrayHelper = require("./arrayHelper.js");

// https://github.com/tc39/proposal-cancellation/tree/master/stage0
const createCancelError = reason => {
  const cancelError = new Error(`canceled because ${reason}`);
  cancelError.name = "CANCEL_ERROR";
  cancelError.reason = reason;
  return cancelError;
};

exports.createCancelError = createCancelError;

const isCancelError = value => {
  return value && typeof value === "object" && value.name === "CANCEL_ERROR";
};

exports.isCancelError = isCancelError;

const createCancellationSource = () => {
  let requested = false;
  let cancelReason;
  let cancelPromise;
  let callbacks = [];

  const cancel = reason => {
    if (requested) {
      return cancelPromise;
    }

    requested = true;
    cancelReason = reason;
    const values = [];
    cancelPromise = callbacks.reduce(async (previous, callback) => {
      await previous;
      const returnValue = callback(reason);
      const value = await returnValue;
      const removedBeforeResolved = callbacks.indexOf(callback) === -1; // if the callback is removed it means
      // what it does is not important

      if (removedBeforeResolved === false) {
        values.push(value);
      }
    }, Promise.resolve()).then(() => {
      callbacks.length = 0;
      return values;
    });
    return cancelPromise;
  };

  const register = callback => {
    const index = callbacks.indexOf(callback); // don't register twice

    if (index === -1) {
      callbacks = [callback, ...callbacks];
    }

    return () => {
      callbacks = (0, _arrayHelper.arrayWithout)(callbacks, callback);
    };
  };

  const throwIfRequested = () => {
    if (requested) {
      throw createCancelError(cancelReason);
    }
  };

  return {
    token: {
      register,

      get cancellationRequested() {
        return requested;
      },

      throwIfRequested
    },
    cancel
  };
};

exports.createCancellationSource = createCancellationSource;

const cancellationTokenCompose = (...tokens) => {
  let requested = false;
  let cancelReason;

  const visit = i => {
    const token = tokens[i];
    const unregister = token.register(reason => {
      if (requested) return;
      requested = true;
      unregister();
      cancelReason = reason;
    });
    if (requested) unregister();
  };

  let i = 0;

  while (i < tokens.length) {
    visit(i++);

    if (requested) {
      break;
    }
  }

  const register = callback => {
    const unregisters = tokens.map(token => token.register(callback));
    return () => unregisters.forEach(unregister => unregister());
  };

  const throwIfRequested = () => {
    if (requested) {
      throw createCancelError(cancelReason);
    }
  };

  return {
    register,

    get cancellationRequested() {
      return requested;
    },

    throwIfRequested
  };
};

exports.cancellationTokenCompose = cancellationTokenCompose;

const createCancellationToken = () => {
  const register = () => () => {};

  const throwIfRequested = () => undefined;

  return {
    register,
    cancellationRequested: false,
    throwIfRequested
  };
};

exports.createCancellationToken = createCancellationToken;

const trackOperation = (cancellationToken, promise, {
  abort,
  stop
} = {}) => {
  const cancelPromise = new Promise((resolve, reject) => {
    const unregisterRejectOnCancel = cancellationToken.register(reason => {
      // unregister immediatly so it won't appear in cancel() values
      unregisterRejectOnCancel();
      reject(createCancelError(reason));
    });
    promise.then(unregisterRejectOnCancel, reject);

    if (abort) {
      const unregisterAbortOnCancel = cancellationToken.register(reason => {
        return abort(reason);
      });
      promise.then(unregisterAbortOnCancel, reject);
    }

    if (stop) {
      cancellationToken.register(reason => {
        return promise.then(() => stop(reason));
      });
    }
  });
  return Promise.race([promise, cancelPromise]);
};

exports.trackOperation = trackOperation;
//# sourceMappingURL=cancellation.js.map