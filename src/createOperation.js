import { createCancellationToken } from "./cancellation.js"

export const createOperation = ({
  cancellationToken = createCancellationToken(),
  start,
  ...rest
}) => {
  if (Object.keys(rest).length)
    throw new Error(
      `createOperation expect only cancellationToken, start. Got ${Object.keys(rest)}`,
    )

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
