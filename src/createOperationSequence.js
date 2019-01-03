import { createCancellationToken } from "./cancellation"
import { createOperation } from "./createOperation.js"

export const createOperationSequence = ({
  cancellationToken = createCancellationToken(),
  array,
  start,
}) => {
  const results = []
  await array.reduce((previous, value) => {
    return createOperation({
      cancellationToken,
      start: async () => {
        await previous
        const result = await start(value)
        results.push(result)
      },
    })
  }, Promise.resolve())
  return results
}
