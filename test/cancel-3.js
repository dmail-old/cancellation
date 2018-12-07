import { assert } from "@dmail/assert"
import { createCancellationSource, isCancelError } from "../index.js"
import { startServer, requestServer } from "./fixtures.js"

const test = async () => {
  {
    const { token: cancellationToken, cancel } = createCancellationSource()

    try {
      const portPromise = startServer({ cancellationToken })
      const port = await portPromise
      const responsePromise = requestServer({ cancellationToken, port })

      cancel("cancel").then((values) => {
        assert({
          actual: values,
          expected: ["request aborted because cancel", "server closed because cancel"],
        })
        console.log("passed")
      })

      const response = await responsePromise
      assert({ actual: response.statusCode, expected: 200 })
    } catch (error) {
      assert({ actual: isCancelError(error), expected: true })
    }
  }
}
test()
