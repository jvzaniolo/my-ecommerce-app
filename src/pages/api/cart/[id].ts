import { NextApiHandler } from 'next'
import * as yup from 'yup'
import { supabase } from '~/services/supabase'

const cartSchema = yup.object({
  id: yup.string().required('Missing cart id.'),
})

const handler: NextApiHandler = async (req, res) => {
  try {
    const { id } = await cartSchema.validate(req.query)

    const access_token = req.cookies['sb-access-token']

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
        .match({ id })
        .single()

      return res.status(status).json(error || data)
    }

    if (req.method === 'DELETE') {
      const { data, status, error } = await supabase
        .from('cart_item')
        .delete()
        .match({ id })
        .single()

      return res.status(status).json(error || data)
    }
  } catch (error: any) {
    return res.status(400).json(error.message)
  }

  res.setHeader('Allow', ['DELETE', 'PATCH'])
  return res.status(405).json('Method Not Allowed')
}

export default handler
