import { NextApiHandler } from 'next'
import { supabase } from '~/services/supabase'

const handler: NextApiHandler = async (req, res) => {
  const cartItemId = req.query.id as string
  const access_token = req.cookies['sb-access-token']

  if (!cartItemId) return res.status(400).json('Missing cart item id.')

  supabase.auth.setAuth(access_token)

  if (req.method === 'PATCH') {
    const { quantity } = req.body

    if (!quantity) return res.status(400).json('Missing quantity.')

    const { data, status, error } = await supabase
      .from('cart_item')
      .update({
        quantity,
      })
      .select('*, product(*)')
      .match({ id: cartItemId })
      .single()

    return res.status(status).json(error || data)
  }

  if (req.method === 'DELETE') {
    const { data, status, error } = await supabase
      .from('cart_item')
      .delete()
      .match({ id: cartItemId })
      .single()

    return res.status(status).json(error || data)
  }

  res.setHeader('Allow', ['DELETE', 'PATCH'])
  return res.status(405).json('Method Not Allowed')
}

export default handler
