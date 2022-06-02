const path = require('path')
const jsonServer = require('json-server')

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.post('/cart', (req, res) => {
  const data = router.db.get('cart').value()

  const product = data.find(item => item.id === req.body.id)

  if (product) {
    const response = router.db
      .get('cart')
      .find({ id: req.body.id })
      .assign({ quantity: product.quantity + req.body.quantity })
      .write()

    res.status(200).jsonp(response)
  } else {
    const response = router.db.get('cart').push(req.body).write()

    res.status(201).jsonp(response)
  }
})

server.use(router)
server.listen(3333, () => {
  console.log('🚀 JSON Server is running')
})
