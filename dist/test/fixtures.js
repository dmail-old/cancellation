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
  await (0, _index.cancellationTokenToPromise)(cancellationToken);

  const server = _http.default.createServer();

  const opened = (0, _index.cancellationTokenWrapPromise)(cancellationToken, new Promise((resolve, reject) => {
    server.on("error", reject);
    server.on("listening", resolve);
    server.listen(3000, "127.0.0.1");
  }));

  const close = async reason => {
    // we must wait for the server to be opened before being able to close it
    await opened;
    return new Promise((resolve, reject) => {
      server.once("close", error => {
        if (error) {
          reject(error);
        } else {
          resolve(`server closed because ${reason}`);
        }
      });
      server.close();
    });
  };

  cancellationToken.register(close);
  process.on("exit", close);
  await opened;
  server.on("request", (request, response) => {
    response.writeHead(200);
    response.end();
  });
};

exports.startServer = startServer;

const requestServer = async ({
  cancellationToken = (0, _index.createCancellationToken)()
} = {}) => {
  await (0, _index.cancellationTokenToPromise)(cancellationToken);

  const request = _http.default.request({
    port: 3000,
    hostname: "127.0.0.1"
  });

  let aborting = false;
  const responded = (0, _index.cancellationTokenWrapPromise)(cancellationToken, new Promise((resolve, reject) => {
    request.on("response", resolve);
    request.on("error", error => {
      // abort will trigger a ECONNRESET error
      if (aborting && error && error.code === "ECONNRESET" && error.message === "socket hang up") {
        return;
      }

      reject(error);
    });
  }));
  request.end();
  const unregisterAbortCancellation = cancellationToken.register(reason => {
    aborting = true;
    return new Promise(resolve => {
      request.on("abort", () => {
        resolve(`request aborted because ${reason}`);
      });
      request.abort();
    });
  });
  responded.then(() => unregisterAbortCancellation());
  return responded;
};

exports.requestServer = requestServer;
//# sourceMappingURL=fixtures.js.map