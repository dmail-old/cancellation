import { createOperation } from "../index.js"
import { expectProcessUnhandledRejections } from "./expectProcessUnhandledRejections.js"

const error = new Error("here")
expectProcessUnhandledRejections({
  expected: [error],
})

createOperation({
  start: () => {
    throw error
  },
})
