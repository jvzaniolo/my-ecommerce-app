import { NextApiHandler } from 'next'
import { supabase } from '~/services/supabase'

const handler: NextApiHandler = async (req, res) => {
  const id = req.query.id as string
  const access_token = req.cookies['sb-access-token']

  supabase.auth.setAuth(access_token)

  if (req.method === 'PATCH') {
    const { quantity } = req.body
    const { data, status, error } = await supabase.rpc('update_cart_item', {
      id,
      new_quantity: quantity,
    })

    return res.status(status).json(error || data)
  } else if (req.method === 'DELETE') {
  }

  res.setHeader('Allow', ['DELETE', 'PATCH'])
  return res.status(405).json({ message: 'Method Not Allowed' })
}

export default handler
