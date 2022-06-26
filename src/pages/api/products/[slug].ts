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

    if (data) {
      const productWithImage = {
        ...data,
        image: supabase.storage.from('product-image').getPublicUrl(data.slug),
      }

      return res.status(status).json(error || productWithImage)
    }

    return res.status(status).json(error)
  }

  res.setHeader('Allow', ['GET'])
  return res.status(405).json('Method Not Allowed')
}

export default handler
