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

  const opened = new Promise((resolve, reject) => {
    server.on("error", reject);
    server.on("listening", () => {
      resolve(server.address().port);
    });
    server.listen(0, "127.0.0.1");
  });

  const close = async reason => {
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

  process.on("exit", close);
  const port = await (0, _index.trackOperation)(cancellationToken, opened, {
    stop: close
  });
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
  const responded = new Promise((resolve, reject) => {
    request.on("response", resolve);
    request.on("error", error => {
      // abort will trigger a ECONNRESET error
      if (aborting && error && error.code === "ECONNRESET" && error.message === "socket hang up") {
        return;
      }

      console.log("yep", cancellationToken.cancellationRequested);
      reject(error);
    });
  });

  const abort = reason => {
    aborting = true;
    return new Promise(resolve => {
      request.on("abort", () => {
        resolve(`request aborted because ${reason}`);
      });
      request.abort();
    });
  };

  request.end();
  return (0, _index.trackOperation)(cancellationToken, responded, {
    abort
  });
};

exports.requestServer = requestServer;
//# sourceMappingURL=fixtures.js.map