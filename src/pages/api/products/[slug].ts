import type { NextApiHandler } from 'next'
import { supabase } from '~/services/supabase'

const handler: NextApiHandler = async (req, res) => {
  const { slug } = req.query

  switch (req.method) {
    case 'GET': {
      const { data, error, status } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        return res.status(status).json({ message: error.message })
      }

      return res.status(status).json(data)
    }
    default: {
      return res.status(405).json({
        message: 'Method Not Allowed',
      })
    }
  }
}

export default handler
