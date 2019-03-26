import { assert } from "@dmail/assert"
import { createStoppableOperation } from "../index.js"
import { registerProcessExitErrorHandler } from "./registerProcessExitErrorHandler.js"

const error = new Error("here")
registerProcessExitErrorHandler(({ errorArray }) => {
  assert({ actual: errorArray, expected: [error] })
})

createStoppableOperation({
  stop: () => {},
  start: () => {
    throw error
  },
})
