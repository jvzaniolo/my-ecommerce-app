import { NextApiHandler } from 'next'
import { supabase } from '~/services/supabase'

const handler: NextApiHandler = async (req, res) => {
  const slug = req.query.slug as string

  if (!slug) return res.status(400).json('Missing data')

  if (req.method === 'GET') {
    const { data, error, status } = await supabase
      .from('product')
      .select('*')
      .match({ slug })
      .single()

    return res.status(status).json(error || data)
  }

  res.setHeader('Allow', ['GET'])
  return res.status(405).json('Method Not Allowed')
}

export default handler
