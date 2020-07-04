const app = require('./bin/express')
const server = require('http').Server(app)

const port = process.env.PORT || 8082

server.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
