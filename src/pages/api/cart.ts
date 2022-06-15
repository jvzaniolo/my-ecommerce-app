import { NextApiHandler } from 'next'
import { supabase } from '~/services/supabase'

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const access_token = req.cookies['sb-access-token']

    supabase.auth.setAuth(access_token)

    const { data, error, status } = await supabase
      .from('cart')
      .select('*, product(*)')

    if (error) {
      res.status(status).json({ message: error.message })
    } else {
      res.status(status).json(data)
    }
  } else {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ message: 'Method Not Allowed' })
  }
}

export default handler
