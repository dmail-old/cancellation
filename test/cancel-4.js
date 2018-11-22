import { createCancellationSource } from "../index.js"
import { startServer, requestServer } from "./fixtures.js"
import assert from "assert"

const test = async () => {
  {
    const { token: cancellationToken, cancel } = createCancellationSource()

    try {
      const portPromise = startServer({ cancellationToken })
      const port = await portPromise
      const responsePromise = requestServer({ cancellationToken, port })
      const response = await responsePromise

      cancel("cancel").then((values) => {
        assert.deepEqual(values, ["server closed because cancel"])
        console.log("passed")
      })

      assert.deepEqual(response.statusCode, 200)
    } catch (error) {
      assert.fail("must no be called")
    }
  }
}
test()
