import { createCancellationToken } from "./cancellation.js"
import { memoizeOnce } from "./memoizeOnce.js"

export const createAbortableOperation = ({
  cancellationToken = createCancellationToken(),
  start,
  abort,
}) => {
  if (typeof abort !== "function")
    throw new TypeError(`createAbortableOperation expect an abort function. got ${abort}`)

  cancellationToken.throwIfRequested()

  const promise = start()
  const cancelPromise = new Promise((resolve, reject) => {
    const cancelRegistration = cancellationToken.register((cancelError) => {
      cancelRegistration.unregister()
      reject(cancelError)
    })
    promise.then(cancelRegistration.unregister)
  })
  const operationPromise = Promise.race([promise, cancelPromise])

  const abortInternal = memoizeOnce(abort)
  const abortRegistration = cancellationToken.register(abortInternal)
  promise.then(abortRegistration.unregister)
  operationPromise.abort = abortInternal

  return operationPromise
}
