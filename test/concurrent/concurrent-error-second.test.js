import { assert } from "@dmail/assert"
import { createConcurrentOperations } from "../../index.js"
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
