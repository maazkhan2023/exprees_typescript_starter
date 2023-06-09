import 'module-alias/register'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import http from 'http'
import App from '..'
import logger from '@/utils/logger.util'

const { app } = new App([])

const normalizePort = (val: any) => {
  const port = parseInt(val, 10)

  if (Number.isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

const port = normalizePort('3030')
app.set('port', port)

const server = http.createServer(app)

const onError = (error: any) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `Pipe ${addr}` : `Port ${addr?.port}`
  logger.info(`Listening on ${bind}`)
}

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
