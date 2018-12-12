import { createCancellationToken, createCancelError } from "./cancellation.js"

export const createOperation = ({
  cancellationToken = createCancellationToken(),
  start,
  // we must have either abort or stop but not both and not none
  stop,
  abort,
}) => {
  cancellationToken.throwIfRequested()

  const promise = start()

  let abortOrStopRequested = false
  let abortOrStopResolve
  const abortOrStopPromise = new Promise((resolve) => {
    abortOrStopResolve = resolve
  })
  const abortOrStop = (reason) => {
    if (abortOrStopRequested) return abortOrStopPromise
    operationPromise.reason = reason
    abortOrStopRequested = true
    abortOrStopResolve(abort ? abort() : promise.then((value) => stop(value)))
    return abortOrStopPromise
  }

  const cancellationRequestedPromise = new Promise((resolve, reject) => {
    const rejectRegistration = cancellationToken.register((reason) => {
      // unregister immediatly so it won't appear in cancel() values
      rejectRegistration.unregister()
      reject(createCancelError(reason))
    })
    promise.then(rejectRegistration.unregister, reject)

    if (abort) {
      const abortRegistration = cancellationToken.register(abortOrStop)
      promise.then(abortRegistration.unregister, reject)
    } else if (stop) {
      cancellationToken.register(abortOrStop)
    }
  })

  const operationPromise = Promise.race([promise, cancellationRequestedPromise])
  operationPromise[stop ? "stop" : "abort"] = abortOrStop

  return operationPromise
}
