import { createCancellationToken } from "./cancellation.js"
import { memoizeOnce } from "./memoizeOnce.js"

export const createStoppableOperation = ({
  cancellationToken = createCancellationToken(),
  start,
  stop,
}) => {
  if (typeof stop !== "function")
    throw new TypeError(`createStoppableOperation expect a stop function. got ${stop}`)

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

  const stopInternal = memoizeOnce(async (reason) => {
    const value = await promise
    return stop(value, reason)
  })
  cancellationToken.register(stopInternal)
  operationPromise.stop = stopInternal

  return operationPromise
}
