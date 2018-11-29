// https://github.com/tc39/proposal-cancellation/tree/master/stage0
import { arrayWithout } from "./arrayHelper.js"

export const createCancelError = (reason) => {
  const cancelError = new Error(`canceled because ${reason}`)
  cancelError.name = "CANCEL_ERROR"
  cancelError.reason = reason
  return cancelError
}

export const isCancelError = (value) => {
  return value && typeof value === "object" && value.name === "CANCEL_ERROR"
}

export const createCancellationSource = () => {
  let requested = false
  let cancelReason
  let cancelPromise
  let registrationArray = []
  const cancel = (reason) => {
    if (requested) {
      return cancelPromise
    }
    requested = true
    cancelReason = reason

    const values = []
    cancelPromise = registrationArray
      .reduce(async (previous, registration) => {
        await previous
        const returnValue = registration.callback(reason)
        const value = await returnValue
        const removedBeforeResolved = registrationArray.indexOf(registration) === -1
        // if the callback is removed it means
        // what it does is not important
        if (removedBeforeResolved === false) {
          values.push(value)
        }
      }, Promise.resolve())
      .then(() => {
        registrationArray.length = 0
        return values
      })

    return cancelPromise
  }

  const register = (callback) => {
    const existingRegistration = registrationArray.find((registration) => {
      return registration.callback === callback
    })
    // don't register twice
    if (existingRegistration) {
      return existingRegistration
    }

    const registration = {
      callback,
      unregister: () => {
        registrationArray = arrayWithout(registrationArray, registration)
      },
    }
    registrationArray = [registration, ...registrationArray]

    return registration
  }

  const throwIfRequested = () => {
    if (requested) {
      throw createCancelError(cancelReason)
    }
  }

  return {
    token: {
      register,
      get cancellationRequested() {
        return requested
      },
      throwIfRequested,
    },
    cancel,
  }
}

export const cancellationTokenCompose = (...tokens) => {
  const register = (callback) => {
    const registrationArray = []

    const visit = (i) => {
      const token = tokens[i]
      const registration = token.register(callback)
      registrationArray.push(registration)
    }
    let i = 0
    while (i < tokens.length) {
      visit(i++)
    }

    const compositeRegistration = {
      callback,
      unregister: () => {
        registrationArray.forEach((registration) => registration.unregister())
        registrationArray.length = 0
      },
    }

    return compositeRegistration
  }

  let requested = false
  let cancelReason
  const internalRegistration = register((reason) => {
    requested = true
    cancelReason = reason
    internalRegistration.unregister()
  })

  const throwIfRequested = () => {
    if (requested) {
      throw createCancelError(cancelReason)
    }
  }

  return {
    register,
    get cancellationRequested() {
      return requested
    },
    throwIfRequested,
  }
}

export const createCancellationToken = () => {
  const register = (callback) => {
    return {
      callback,
      unregister: () => {},
    }
  }

  const throwIfRequested = () => undefined

  return {
    register,
    cancellationRequested: false,
    throwIfRequested,
  }
}

export const cancellationTokenToPromise = (cancellationToken) => {
  return new Promise((resolve, reject) => {
    cancellationToken.throwIfRequested()
    const rejectRegistration = cancellationToken.register((reason) => {
      rejectRegistration.unregister()
      reject(createCancelError(reason))
    })
  })
}