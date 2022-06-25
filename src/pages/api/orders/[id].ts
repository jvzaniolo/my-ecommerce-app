import { NextApiHandler } from 'next'
import * as yup from 'yup'
import { supabase } from '~/services/supabase'

const getOrderSchema = yup.object({
  id: yup.string().required('Missing order id.'),
})

const handler: NextApiHandler = async (req, res) => {
  const { token } = await supabase.auth.api.getUserByCookie(req)

  if (token) supabase.auth.setAuth(token)

  if (req.method === 'GET') {
    try {
      const { id } = await getOrderSchema.validate(req.query)

      const { data, error, status } = await supabase
        .from('order')
        .select('*, user(*), items:order_item(*, product(*))')
        .match({ id })
        .single()

      return res.status(status).json(error || data)
    } catch (error: any) {
      return res.status(400).json(error.message)
    }
  }

  res.setHeader('Allow', ['GET'])
  return res.status(405).json('Method Not Allowed')
}

export default handler
