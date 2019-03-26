import { assert } from "@dmail/assert"
import { createConcurrentOperations } from "../../index.js"
import { registerProcessExitErrorHandler } from "../registerProcessExitErrorHandler.js"

registerProcessExitErrorHandler(({ unhandledRejectionArray }) => {
  assert({ actual: unhandledRejectionArray, expected: [] })
})

// force-new-line
;(async () => {
  const resultArray = await createConcurrentOperations({
    array: ["a", "b", "c", "d"],
    maxParallelExecution: 2,
    start: (value) => Promise.resolve(value),
  })
  assert({ actual: resultArray, expected: ["a", "b", "c", "d"] })
})()
