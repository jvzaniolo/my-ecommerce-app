import { NextApiHandler } from 'next'
import { supabase } from '~/services/supabase'

const handler: NextApiHandler = async (req, res) => {
  const access_token = req.cookies['sb-access-token']

  supabase.auth.setAuth(access_token)

  if (req.method === 'GET') {
    const { data, status, error } = await supabase
      .from('cart')
      .select('*, items:cart_item(*, product(*))')
      .single()

    return res.status(status).json(error || data)
  }

  if (req.method === 'POST') {
    const { productId, quantity } = req.body

    if (!quantity) return res.status(400).json('Missing quantity.')
    if (!productId) return res.status(400).json('Missing product id.')

    const { user } = await supabase.auth.api.getUserByCookie(req)

    // TODO: allow anonymous user to add items to cart
    if (!user) return res.status(401).json('Unauthorized')

    const {
      data: cart,
      status: cartStatus,
      error: cartError,
    } = await supabase
      .from('cart')
      .select('id')
      .match({ user_id: user.id })
      .single()

    if (cartError) return res.status(cartStatus).json(cartError)

    // Check for existing cart item
    const {
      data: cartItem,
      status: cartItemStatus,
      error: cartItemError,
    } = await supabase
      .from('cart_item')
      .select('id, quantity')
      .match({ product_id: productId })

    if (cartItemError) return res.status(cartItemStatus).json(cartItemError)

    // If cart item exists, update the quantity with the new quantity
    if (cartItem.length) {
      const {
        data: updatedCartItem,
        status: updatedCartItemStatus,
        error: updatedCartItemError,
      } = await supabase
        .from('cart_item')
        .update({ quantity: cartItem[0].quantity + quantity })
        .match({ product_id: productId })
        .single()

      return res
        .status(updatedCartItemStatus)
        .json(updatedCartItemError || updatedCartItem)
    }

    // Or else, create a new cart item
    const { data, error, status } = await supabase
      .from('cart_item')
      .insert({
        quantity,
        cart_id: cart.id,
        user_id: user.id,
        product_id: productId,
      })
      .select('*, product(*)')
      .single()

    return res.status(status).json(error || data)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json('Method Not Allowed')
}

export default handler
