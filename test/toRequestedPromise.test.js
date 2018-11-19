import assert from "assert"
import { createCancellationSource } from "../index.js"

{
  const test = async () => {
    const { token, cancel } = createCancellationSource()

    cancel("cancel")
    const reason = await token.toRequestedPromise()

    assert.equal(reason, "cancel")
  }
  test()
}

{
  const test = async () => {
    const { token, cancel } = createCancellationSource()

    setTimeout(() => cancel("cancel"), 10)
    const reason = await token.toRequestedPromise()

    assert.equal(reason, "cancel")
  }
  test()
}
