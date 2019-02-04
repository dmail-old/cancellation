import { assert } from "@dmail/assert"
import {
  createCancellationSource,
  createCancellationToken,
  cancellationTokenCompose,
} from "../index.js"

{
  const cancellationSource = createCancellationSource()
  const cancellationSourceToken = cancellationSource.token
  const cancellationToken = createCancellationToken()
  const compositeCancellationToken = cancellationTokenCompose(
    cancellationToken,
    cancellationSourceToken,
  )
  cancellationSource.cancel()

  assert({
    actual: compositeCancellationToken.cancellationRequested,
    // we should expect true here
    // but because cancel is async and awaits previous registration
    // cancellation is not propaged sync
    expected: false,
  })
}
