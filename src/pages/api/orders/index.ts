import { NextApiHandler } from 'next'
import { supabase } from '~/services/supabase'

const handler: NextApiHandler = async (req, res) => {
  const access_token = req.cookies['sb-access-token']

  supabase.auth.setAuth(access_token)

  if (req.method === 'POST') {
    const { cart } = req.body

    if (!cart.items) return res.status(400).json('Missing cart items.')

    const { user } = await supabase.auth.api.getUserByCookie(req)

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
      .select('id')
      .single()

    if (orderError) return res.status(orderStatus).json(orderError)

    const { data, error, status } = await supabase
      .from('order_item')
      .insert(
        cart.items.map((item: any) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          user_id: user.id,
        }))
      )
      .select('*, product(*)')

    return res.status(status).json(error || { ...order, items: data })
  }

  res.setHeader('Allow', ['POST'])
  return res.status(405).json('Method Not Allowed')
}

export default handler
