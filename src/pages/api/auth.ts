import { NextApiHandler } from 'next'
import { prisma } from '~/server/prisma'
import { supabase } from '~/server/supabase'

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    supabase.auth.api.setAuthCookie(req, res)

    const { user } = await supabase.auth.api.getUserByCookie(req)

    if (!user) throw new Error('User not found')

    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email as string,
        cart: {
          create: {},
        },
      },
    })
  }

  if (req.method === 'DELETE') {
    return supabase.auth.api.deleteAuthCookie(req, res, { redirectTo: '/' })
  }

  res.setHeader('Allow', ['POST', 'DELETE'])
  return res.status(405).json('Method Not Allowed')
}

export default handler
