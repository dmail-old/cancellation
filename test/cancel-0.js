import { createCancellationSource } from "../index.js"
import { startServer, requestServer } from "./fixtures.js"
import assert from "assert"
import { isCancelError } from "../src/cancellation.js"

const test = async () => {
  {
    const { token: cancellationToken, cancel } = createCancellationSource()

    try {
      cancel("cancel").then((values) => {
        assert.deepEqual(values, [])
        console.log("passed")
      })

      const portPromise = startServer({ cancellationToken })
      const port = await portPromise
      const responsePromise = requestServer({ cancellationToken, port })
      const response = await responsePromise
      assert.deepEqual(response.statusCode, 200)
    } catch (error) {
      assert.equal(isCancelError(error), true)
    }
  }
}
test()
