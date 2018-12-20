"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCancellationToken = exports.cancellationTokenCompose = exports.createCancellationSource = exports.isCancelError = exports.createCancelError = void 0;

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
  let cancelError;
  let cancelPromise;
  let registrationArray = [];

  const cancel = reason => {
    if (requested) return cancelPromise;
    requested = true;
    cancelError = createCancelError(reason);
    const values = [];
    cancelPromise = registrationArray.reduce(async (previous, registration) => {
      await previous;
      const returnValue = registration.callback(cancelError);
      const value = await returnValue;
      const removedBeforeResolved = registrationArray.indexOf(registration) === -1; // if the callback is removed it means
      // what it does is not important

      if (removedBeforeResolved === false) {
        values.push(value);
      }
    }, Promise.resolve()).then(() => {
      registrationArray.length = 0;
      return values;
    });
    return cancelPromise;
  };

  const register = callback => {
    const existingRegistration = registrationArray.find(registration => {
      return registration.callback === callback;
    }); // don't register twice

    if (existingRegistration) {
      return existingRegistration;
    }

    const registration = {
      callback,
      unregister: () => {
        registrationArray = (0, _arrayHelper.arrayWithout)(registrationArray, registration);
      }
    };
    registrationArray = [registration, ...registrationArray];
    return registration;
  };

  const throwIfRequested = () => {
    if (requested) {
      throw createCancelError(cancelError);
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
  const register = callback => {
    const registrationArray = [];

    const visit = i => {
      const token = tokens[i];
      const registration = token.register(callback);
      registrationArray.push(registration);
    };

    let i = 0;

    while (i < tokens.length) {
      visit(i++);
    }

    const compositeRegistration = {
      callback,
      unregister: () => {
        registrationArray.forEach(registration => registration.unregister());
        registrationArray.length = 0;
      }
    };
    return compositeRegistration;
  };

  let requested = false;
  let cancelError;
  const internalRegistration = register(parentCancelError => {
    requested = true;
    cancelError = parentCancelError;
    internalRegistration.unregister();
  });

  const throwIfRequested = () => {
    if (requested) {
      throw cancelError;
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
  const register = callback => {
    return {
      callback,
      unregister: () => {}
    };
  };

  const throwIfRequested = () => undefined;

  return {
    register,
    cancellationRequested: false,
    throwIfRequested
  };
};

exports.createCancellationToken = createCancellationToken;
//# sourceMappingURL=./cancellation.js.map