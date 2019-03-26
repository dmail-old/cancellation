import { assert } from "@dmail/assert"
import { createAbortableOperation } from "../index.js"
import { registerProcessExitErrorHandler } from "./registerProcessExitErrorHandler.js"

const error = new Error("here")
registerProcessExitErrorHandler(({ errorArray }) => {
  assert({ actual: errorArray, expected: [error] })
})

createAbortableOperation({
  abort: () => {},
  start: () => {
    throw error
  },
})
