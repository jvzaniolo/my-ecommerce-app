import { NextApiHandler } from 'next'
import { supabase } from '~/services/supabase'
import { Cart } from '~/types'

const handler: NextApiHandler = async (req, res) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(req)

  if (token) supabase.auth.setAuth(token)

  if (req.method === 'POST') {
    const cart = req.body.cart as Cart

    if (!cart.items) return res.status(400).json('Missing cart items.')

    if (!user) return res.status(401).json('Unauthorized')

    const {
      data: order,
      status: orderStatus,
      error: orderError,
    } = await supabase
      .from('order')
      .insert([
        {
          user_id: user.id,
        },
      ])
      .select('*')
      .single()

    if (orderError) return res.status(orderStatus).json(orderError)

    const { data, error, status } = await supabase
      .from('order_item')
      .insert(
        cart.items.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          user_id: user.id,
        }))
      )
      .select('*, product(*)')

    if (!error) {
      cart.items.forEach(async item => {
        const response = await Promise.all([
          supabase
            .from('product')
            .update({
              stock: item.product.stock - item.quantity,
            })
            .match({ product_id: item.product_id }),

          supabase.from('cart_item').delete().match({ id: item.id }),
        ])

        if (response[0].error) {
          return res.status(response[0].status).json(response[0].error)
        }

        if (response[1].error) {
          return res.status(response[1].status).json(response[1].error)
        }
      })
    }

    return res.status(status).json(error || { ...order, items: data })
  }

  res.setHeader('Allow', ['POST'])
  return res.status(405).json('Method Not Allowed')
}

export default handler
