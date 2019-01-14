import { assert } from "@dmail/assert"
import { arrayWithout } from "@dmail/helper"

export const expectProcessUnhandledRejections = ({ message, expected }) => {
  let unhandledRejections = []

  process.on("unhandledRejection", (error, promise) => {
    unhandledRejections = [...unhandledRejections, { error, promise }]
  })
  process.on("rejectionHandled", (promise) => {
    unhandledRejections = arrayWithout(
      unhandledRejections,
      (unhandledRejection) => unhandledRejection.promise === promise,
    )
  })

  process.on("exit", () => {
    if (process.exitCode === 0 || process.exitCode === undefined) {
      const actual = unhandledRejections.map(({ error }) => error)
      assert({
        message,
        actual,
        expected,
      })
    }
  })
}
