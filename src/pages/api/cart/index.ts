import type { NextApiHandler } from 'next'
import { supabase } from '~/services/supabase'

const handler: NextApiHandler = async (req, res) => {
  const access_token = req.cookies['sb-access-token']

  supabase.auth.setAuth(access_token)

  if (req.method === 'GET') {
    const { data, status, error } = await supabase
      .from('cart')
      .select('*, items:cart_item(*, product(*))')

    return res.status(status).json(error || data)
  }

  if (req.method === 'POST') {
    const { product_id, quantity } = req.body

    const { data, error, status } = await supabase.rpc('insert_item_to_cart', {
      new_product_id: product_id,
      new_quantity: quantity,
    })

    return res.status(status).json(error || data)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ message: 'Method Not Allowed' })
}

export default handler
