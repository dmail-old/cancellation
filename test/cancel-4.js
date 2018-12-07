import { assert } from "@dmail/assert"
import { createCancellationSource } from "../index.js"
import { startServer, requestServer } from "./fixtures.js"

const test = async () => {
  {
    const { token: cancellationToken, cancel } = createCancellationSource()

    try {
      const portPromise = startServer({ cancellationToken })
      const port = await portPromise
      const responsePromise = requestServer({ cancellationToken, port })
      const response = await responsePromise

      cancel("cancel").then((values) => {
        assert({ actual: values, expected: ["server closed because cancel"] })
        console.log("passed")
      })

      assert({ actual: response.statusCode, expected: 200 })
    } catch (error) {
      assert({ message: "must no be called", actual: true, expected: false })
    }
  }
}
test()
