import { NextApiHandler } from 'next'
import { supabase } from '~/services/supabase'

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const { data, error, status } = await supabase.from('product').select('*')

    if (data) {
      const productsWithImage = data.map(product => {
        return {
          ...product,
          image: supabase.storage
            .from('product-image')
            .getPublicUrl(product.slug),
        }
      })

      console.log(productsWithImage)

      return res.status(status).json(error || productsWithImage)
    }

    return res.status(status).json(error)
  }

  res.setHeader('Allow', ['GET'])
  return res.status(405).json('Method Not Allowed')
}

export default handler
