import { createCancellationToken } from "./cancellation"
import { createOperation } from "./createOperation.js"

export const createConcurrentOperations = ({
  cancellationToken = createCancellationToken(),
  maxParallelExecution = 5,
  array = [],
  start,
  ...rest
}) => {
  ensureExactParameters(rest)
  cancellationToken.throwIfRequested()

  const results = []
  const firstChunk = array.slice(0, maxParallelExecution)
  let globalIndex = maxParallelExecution - 1

  const execute = async (data, index) => {
    return createOperation({
      cancellationToken,
      start: async () => {
        const value = await start(data)
        results[index] = value
        if (globalIndex < array.length - 1) {
          globalIndex++
          return execute(array[globalIndex], globalIndex)
        }
        return undefined
      },
    })
  }

  return createOperation({
    cancellationToken,
    start: async () => {
      const promises = firstChunk.map((data, index) => execute(data, index))
      await Promise.all(promises)
      return results
    },
  })
}

const ensureExactParameters = (extraParameters) => {
  const extraParamNames = Object.keys(extraParameters)
  if (extraParamNames.length)
    throw new Error(
      `createConcurrentOperations expect only cancellationToken, maxParallelExecution, array, start. Got ${extraParamNames}`,
    )
}
