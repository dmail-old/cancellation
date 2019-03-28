import { assert } from "/node_modules/@dmail/assert/index.js"
import { createConcurrentOperations } from "../../../index.js"
import { registerProcessExitErrorHandler } from "../registerProcessExitErrorHandler.js"

const error = new Error("here")
let startedCount = 0

registerProcessExitErrorHandler(({ unhandledRejectionArray }) => {
  assert({ actual: unhandledRejectionArray, expected: [error] })
  assert({
    actual: startedCount,
    expected: 2,
  })
})

createConcurrentOperations({
  array: ["a", "b", "c", "d"],
  maxParallelExecution: 2,
  start: (value) => {
    startedCount++
    if (value === "b") throw error
  },
})
