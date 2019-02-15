"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConcurrentOperations = void 0;

var _cancellation = require("./cancellation");

var _createOperation = require("./createOperation.js");

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const createConcurrentOperations = (_ref) => {
  let {
    cancellationToken = (0, _cancellation.createCancellationToken)(),
    maxParallelExecution = 5,
    array = [],
    start
  } = _ref,
      rest = _objectWithoutProperties(_ref, ["cancellationToken", "maxParallelExecution", "array", "start"]);

  if (Object.keys(rest).length) throw createExtraParameterError(rest);
  const results = [];
  let progressionIndex = 0;

  const executeNext = async () => {
    const index = progressionIndex;
    progressionIndex++;
    const data = array[index];
    return (0, _createOperation.createOperation)({
      cancellationToken,
      start: async () => {
        const value = await start(data);
        results[index] = value;

        if (progressionIndex < array.length - 1) {
          await executeNext();
        }
      }
    });
  };

  await (0, _createOperation.createOperation)({
    cancellationToken,
    start: async () => {
      await Promise.all(array.slice(0, maxParallelExecution).map(() => executeNext()));
    }
  });
  return results;
};

exports.createConcurrentOperations = createConcurrentOperations;

const createExtraParameterError = extraParameter => {
  return new Error(`only cancellationToken, maxParallelExecution, array, start expected. received ${Object.keys(extraParameter)}`);
};
//# sourceMappingURL=./createConcurrentOperations.js.map