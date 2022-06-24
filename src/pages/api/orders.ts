import { NextApiHandler } from 'next'
import { supabase } from '~/services/supabase'

const handler: NextApiHandler = async (req, res) => {
  const access_token = req.cookies['sb-access-token']

  supabase.auth.setAuth(access_token)

  if (req.method === 'GET') {
    const { data, status, error } = await supabase
      .from('order')
      .select('*, items:order_item(*, product(*))')

    return res.status(status).json(error || data)
  }

  if (req.method === 'POST') {
    const { cartItems } = req.body as {
      cartItems: { product_id: string; quantity: number }[]
    }

    if (!cartItems) return res.status(400).json('Missing cart items.')

    const { user } = await supabase.auth.api.getUserByCookie(req)

    if (!user) return res.status(401).json('Unauthorized')

    const {
      data: orderId,
      status: orderStatus,
      error: orderError,
    } = await supabase
      .from('order')
      .insert([
        {
          user_id: user.id,
        },
      ])
      .select('id')
      .single()

    if (orderError) return res.status(orderStatus).json(orderError)

    const { data, error, status } = await supabase
      .from('order_item')
      .insert(
        cartItems.map(item => ({
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
        }))
      )
      .select('*, product(*)')

    return res.status(status).json(error || data)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json('Method Not Allowed')
}

export default handler
