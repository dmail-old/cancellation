import http from "http"
import { createCancellationToken, createOperation } from "../index.js"

export const startServer = async ({ cancellationToken = createCancellationToken() } = {}) => {
  cancellationToken.throwIfRequested()

  const server = http.createServer()

  const promise = new Promise((resolve, reject) => {
    server.on("error", reject)
    server.on("listening", () => {
      resolve(server.address().port)
    })
    server.listen(0, "127.0.0.1")
  })

  const stop = (reason) =>
    new Promise((resolve, reject) => {
      server.once("close", (error) => {
        if (error) {
          reject(error)
        } else {
          resolve(`server closed because ${reason}`)
        }
      })
      server.close()
    })

  const operation = createOperation({ cancellationToken, promise, stop })

  process.on("exit", operation.cancel)

  const port = await operation

  server.on("request", (request, response) => {
    response.writeHead(200)
    response.end()
  })

  return port
}

export const requestServer = async ({ cancellationToken = createCancellationToken(), port }) => {
  cancellationToken.throwIfRequested()

  const request = http.request({
    port,
    hostname: "127.0.0.1",
  })

  let aborting = false
  const promise = new Promise((resolve, reject) => {
    request.on("response", resolve)
    request.on("error", (error) => {
      // abort may trigger a ECONNRESET error
      if (aborting && error && error.code === "ECONNRESET" && error.message === "socket hang up") {
        return
      }
      reject(error)
    })
  })

  const abort = (reason) =>
    new Promise((resolve) => {
      aborting = true
      request.on("abort", () => {
        resolve(`request aborted because ${reason}`)
      })
      request.abort()
    })

  const operation = createOperation({ cancellationToken, promise, abort })

  request.end()

  return operation
}
