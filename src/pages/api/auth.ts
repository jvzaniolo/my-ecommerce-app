import type { NextApiHandler } from 'next'
import { supabase } from '~/services/supabase'

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    return supabase.auth.api.setAuthCookie(req, res)
  }

  res.setHeader('Allow', ['POST'])
  return res.status(405).json({ message: 'Method Not Allowed' })
}

export default handler
