import { NextApiHandler } from 'next'
import { supabase } from '~/server/supabase'

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    return supabase.auth.api.setAuthCookie(req, res)
  }

  if (req.method === 'DELETE') {
    return supabase.auth.api.deleteAuthCookie(req, res, {})
  }

  res.setHeader('Allow', ['POST', 'DELETE'])
  return res.status(405).json('Method Not Allowed')
}

export default handler
