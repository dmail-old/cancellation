"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOperationSequence = void 0;

var _cancellation = require("./cancellation");

var _createOperation = require("./createOperation.js");

const createOperationSequence = async ({
  cancellationToken = (0, _cancellation.createCancellationToken)(),
  array,
  start
}) => {
  const results = [];
  await array.reduce((previous, value) => {
    return (0, _createOperation.createOperation)({
      cancellationToken,
      start: async () => {
        await previous;
        const result = await start(value);
        results.push(result);
      }
    });
  }, Promise.resolve());
  return results;
};

exports.createOperationSequence = createOperationSequence;
//# sourceMappingURL=./createOperationSequence.js.map