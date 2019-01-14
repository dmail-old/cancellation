import { createStoppableOperation } from "../index.js"
import { expectProcessUnhandledRejections } from "./expectProcessUnhandledRejections.js"

const error = new Error("here")
expectProcessUnhandledRejections({
  message: "one unhandled rejection",
  expected: [error],
})

createStoppableOperation({
  stop: () => {},
  start: () => {
    throw error
  },
})
