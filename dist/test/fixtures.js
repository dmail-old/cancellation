"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestServer = exports.startServer = void 0;

var _http = _interopRequireDefault(require("http"));

var _index = require("../index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const startServer = async ({
  cancellationToken = (0, _index.createCancellationToken)()
} = {}) => {
  cancellationToken.throwIfRequested();

  const server = _http.default.createServer();

  const promise = new Promise((resolve, reject) => {
    server.on("error", reject);
    server.on("listening", () => {
      resolve(server.address().port);
    });
    server.listen(0, "127.0.0.1");
  });

  const stop = reason => new Promise((resolve, reject) => {
    server.once("close", error => {
      if (error) {
        reject(error);
      } else {
        resolve(`server closed because ${reason}`);
      }
    });
    server.close();
  });

  const operation = (0, _index.createOperation)({
    cancellationToken,
    promise,
    stop
  });
  process.on("exit", operation.cancel);
  const port = await operation;
  server.on("request", (request, response) => {
    response.writeHead(200);
    response.end();
  });
  return port;
};

exports.startServer = startServer;

const requestServer = async ({
  cancellationToken = (0, _index.createCancellationToken)(),
  port
}) => {
  cancellationToken.throwIfRequested();

  const request = _http.default.request({
    port,
    hostname: "127.0.0.1"
  });

  let aborting = false;
  const promise = new Promise((resolve, reject) => {
    request.on("response", resolve);
    request.on("error", error => {
      // abort may trigger a ECONNRESET error
      if (aborting && error && error.code === "ECONNRESET" && error.message === "socket hang up") {
        return;
      }

      reject(error);
    });
  });

  const abort = reason => new Promise(resolve => {
    aborting = true;
    request.on("abort", () => {
      resolve(`request aborted because ${reason}`);
    });
    request.abort();
  });

  const operation = (0, _index.createOperation)({
    cancellationToken,
    promise,
    abort
  });
  request.end();
  return operation;
};

exports.requestServer = requestServer;
//# sourceMappingURL=fixtures.js.map