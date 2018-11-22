import { createCancellationSource } from "../index.js"
import { startServer, requestServer } from "./fixtures.js"
import assert from "assert"
import { isCancelError } from "../src/cancellation.js"

const test = async () => {
  {
    const { token: cancellationToken, cancel } = createCancellationSource()

    try {
      const portPromise = startServer({ cancellationToken })

      cancel("cancel").then((values) => {
        assert.deepEqual(values, ["server closed because cancel"])
        console.log("passed")
      })

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
