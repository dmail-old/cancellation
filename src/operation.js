import { createCancellationToken, createCancelError } from "./cancellation.js"

export const createOperation = ({
  cancellationToken = createCancellationToken(),
  stop,
  abort,
  promise,
}) => {
  // we must have either abort or stop but not both and not none

  let cancelRequested = false
  let cancelResolve
  const cancelPromise = new Promise((resolve) => {
    cancelResolve = resolve
  })
  const cancel = (reason) => {
    if (cancelRequested) return cancelPromise
    cancelRequested = true
    cancelResolve(abort ? abort(reason) : promise.then(() => stop(reason)))
    return cancelPromise
  }

  const cancellationRequestedPromise = new Promise((resolve, reject) => {
    const rejectRegistration = cancellationToken.register((reason) => {
      // unregister immediatly so it won't appear in cancel() values
      rejectRegistration.unregister()
      reject(createCancelError(reason))
    })
    promise.then(rejectRegistration.unregister, reject)

    if (abort) {
      const abortRegistration = cancellationToken.register(cancel)
      promise.then(abortRegistration.unregister, reject)
    } else if (stop) {
      cancellationToken.register(cancel)
    }
  })

  const operationPromise = Promise.race([promise, cancellationRequestedPromise])
  operationPromise.cancel = cancel

  return operationPromise
}
