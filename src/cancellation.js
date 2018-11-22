// https://github.com/tc39/proposal-cancellation/tree/master/stage0
import { arrayWithout } from "./arrayHelper.js"

export const createCancellationSource = () => {
  let canceled = false
  let callbacks = []
  let requestedResolve
  let cancelPromise
  const requestedPromise = new Promise((resolve) => {
    requestedResolve = resolve
  })

  const toRequestedPromise = () => requestedPromise

  const cancel = (reason) => {
    if (canceled) {
      return cancelPromise
    }
    canceled = true
    requestedResolve(reason)

    const values = []
    cancelPromise = callbacks
      .reduce((previous, callback, index) => {
        return previous.then(() => callback(reason)).then((value) => {
          values[index] = value
        })
      }, Promise.resolve())
      .then(() => values)
    return cancelPromise
  }

  const register = (callback) => {
    const index = callbacks.indexOf(callback)
    if (index > -1) {
      return () => {
        callbacks = arrayWithout(callbacks, callback)
      }
    }
    callbacks = [callback, ...callbacks]
    return () => {
      callbacks = arrayWithout(callbacks, callback)
    }
  }

  return {
    token: {
      toRequestedPromise,
      register,
    },
    cancel,
  }
}

export const cancellationTokenCompose = (...tokens) => {
  const register = (callback) => {
    const unregisters = tokens.map((token) => token.register(callback))
    return () => unregisters.forEach((unregister) => unregister())
  }

  const toRequestedPromise = () => {
    return Promise.race([tokens.map((token) => token.toRequestedPromise())])
  }

  return {
    toRequestedPromise,
    register,
  }
}

export const createCancellationToken = () => {
  return {
    toRequestedPromise: () => new Promise(() => {}),
    register: () => () => {},
  }
}

const pendingFlag = {}
const cancellationTokenToPromiseIfRequested = (
  { toRequestedPromise },
  promises,
  requestedToPromise,
) => {
  if (promises.length === 0) {
    return Promise.race([toRequestedPromise(), pendingFlag]).then((value) => {
      return value === pendingFlag ? undefined : requestedToPromise(value)
    })
  }
  return Promise.race([...promises, toRequestedPromise().then(requestedToPromise)])
}

export const createCancelError = (reason) => {
  const cancelError = new Error(`canceled because ${reason}`)
  cancelError.name = "CANCEL_ERROR"
  cancelError.reason = reason
  return cancelError
}
const toRejectedPromise = (reason) => Promise.reject(createCancelError(reason))
export const toRejectedIfRequested = (cancellationToken, ...promises) => {
  return cancellationTokenToPromiseIfRequested(cancellationToken, promises, toRejectedPromise)
}
// It may lead to memory leak but it has to be tested
const toPendingPromise = () => new Promise(() => {})
export const toPendingIfRequested = (cancellationToken, ...promises) => {
  return cancellationTokenToPromiseIfRequested(cancellationToken, promises, toPendingPromise)
}

// export const cancelllationTokenCanceled = {
//   register: () => () => {},
//   isRequested: () => true,
//   toPromise: () => cancellationToPromise(),
// }
