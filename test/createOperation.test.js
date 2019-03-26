import { assert } from "@dmail/assert"
import { createOperation } from "../index.js"
import { registerProcessExitErrorHandler } from "./registerProcessExitErrorHandler.js"

const error = new Error("here")
registerProcessExitErrorHandler(({ errorArray }) => {
  assert({ actual: errorArray, expected: [error] })
})

createOperation({
  start: () => {
    throw error
  },
})
