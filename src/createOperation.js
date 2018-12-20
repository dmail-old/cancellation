import { createCancellationToken } from "./cancellation.js"

export const createOperation = ({ cancellationToken = createCancellationToken(), start }) => {
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

  return operationPromise
}
