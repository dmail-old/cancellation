import { createCancellationSource } from "../index.js"
import { startServer, requestServer } from "./fixtures.js"
import assert from "assert"
import { isCancelError } from "../src/cancellation.js"

const test = async () => {
  {
    const { token: cancellationToken, cancel } = createCancellationSource()

    try {
      const portPromise = startServer({ cancellationToken })
      const port = await portPromise
      const responsePromise = requestServer({ cancellationToken, port })

      // setTimeout allow to trigger socket hangup error
      setTimeout(() => {
        cancel("cancel").then((values) => {
          assert.deepEqual(values, [
            "request aborted because cancel",
            "server closed because cancel",
          ])
          console.log("passed")
        })
      }, 2)

      const response = await responsePromise
      assert.deepEqual(response.statusCode, 200)
    } catch (error) {
      assert.equal(isCancelError(error), true)
    }
  }
}
test()
