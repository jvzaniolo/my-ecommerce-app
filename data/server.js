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

server.post('/orders', (req, res) => {
  const cartData = router.db.get('cart').value()
  const itemsData = router.db.get('items').value()

  const total = cartData.reduce((acc, item) => {
    return acc + item.price * item.quantity
  }, 0)

  req.body.items.forEach(item => {
    const product = itemsData.find(product => product.id === item.id)

    if (product) {
      router.db
        .get('items')
        .find({ id: item.id })
        .assign({ stock: product.stock - item.quantity })
        .write()
    }
  })

  router.db.get('cart').remove().write()

  const order = {
    id: Math.floor(Math.random() * 1000000),
    email: req.body.shipping.email,
    items: req.body.items,
    total,
    shipping: req.body.shipping,
    billing: req.body.billing,
    payment: req.body.payment,
  }

  router.db.get('orders').push(order).write()

  res.status(201).jsonp(order)
})

server.use(router)
server.listen(3333, () => {
  console.log('🚀 JSON Server is running')
})
