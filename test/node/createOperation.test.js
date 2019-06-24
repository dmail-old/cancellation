import { assert } from "/node_modules/@dmail/assert/index.js"
import { createOperation } from "../../index.js"
import { registerProcessExitCallback } from "./registerProcessExitCallback.js"

const error = new Error("here")
registerProcessExitCallback(({ exceptionArray }) => {
  assert({ actual: exceptionArray, expected: [{ exception: error, origin: "uncaughtException" }] })
  process.exitCode = 0
})

createOperation({
  start: () => {
    throw error
  },
})
