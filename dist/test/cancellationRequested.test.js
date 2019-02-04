"use strict";

var _assert = require("@dmail/assert");

var _index = require("../index.js");

{
  const cancellationSource = (0, _index.createCancellationSource)();
  const cancellationSourceToken = cancellationSource.token;
  const cancellationToken = (0, _index.createCancellationToken)();
  const compositeCancellationToken = (0, _index.cancellationTokenCompose)(cancellationToken, cancellationSourceToken);
  cancellationSource.cancel();
  (0, _assert.assert)({
    actual: compositeCancellationToken.cancellationRequested,
    // we should expect true here
    // but because cancel is async and awaits previous registration
    // cancellation is not propaged sync
    expected: false
  });
}
//# sourceMappingURL=./cancellationRequested.test.js.map