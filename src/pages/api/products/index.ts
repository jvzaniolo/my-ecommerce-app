import type { NextApiHandler } from 'next'
import { supabase } from '~/services/supabase'

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const { data, error, status } = await supabase.from('product').select('*')

    return res.status(status).json(error || data)
  }

  res.setHeader('Allow', ['GET'])
  return res.status(405).json({ message: 'Method Not Allowed' })
}

export default handler
