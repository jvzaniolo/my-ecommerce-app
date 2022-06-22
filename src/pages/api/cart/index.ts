import { NextApiHandler } from 'next'
import { supabase } from '~/services/supabase'

const handler: NextApiHandler = async (req, res) => {
  const access_token = req.cookies['sb-access-token']

  supabase.auth.setAuth(access_token)

  if (req.method === 'GET') {
    const { data, status, error } = await supabase
      .from('cart')
      .select('*, items:cart_item(*, product(*))')
      .single()

    return res.status(status).json(error || data)
  }

  if (req.method === 'POST') {
    const { productId, quantity } = req.body

    const { data, error, status } = await supabase.rpc('create_cart_item', {
      productid: productId,
      productquantity: quantity,
    })

    return res.status(status).json(error || data)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ message: 'Method Not Allowed' })
}

export default handler
