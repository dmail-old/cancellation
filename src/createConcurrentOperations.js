import { createCancellationToken } from "./cancellation"
import { createOperation } from "./createOperation.js"

export const createConcurrentOperations = ({
  cancellationToken = createCancellationToken(),
  maxParallelExecution = 5,
  array = [],
  start,
  ...rest
}) => {
  if (Object.keys(rest).length) throw createExtraParameterError(rest)

  const results = []
  let progressionIndex = 0

  const executeNext = async () => {
    const index = progressionIndex
    progressionIndex++
    const data = array[index]
    return createOperation({
      cancellationToken,
      start: async () => {
        const value = await start(data)
        results[index] = value
        if (progressionIndex < array.length - 1) {
          await executeNext()
        }
      },
    })
  }

  await createOperation({
    cancellationToken,
    start: async () => {
      await Promise.all(array.slice(0, maxParallelExecution).map(() => executeNext()))
    },
  })

  return results
}

const createExtraParameterError = (extraParameter) => {
  return new Error(
    `only cancellationToken, maxParallelExecution, array, start expected. received ${Object.keys(
      extraParameter,
    )}`,
  )
}
