import superjson from 'superjson'
import { createRouter } from '../context'
import { cartRouter } from './cart'
import { orderRouter } from './order'
import { productRouter } from './product'
import { userRouter } from './user'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', userRouter)
  .merge('product.', productRouter)
  .merge('cart.', cartRouter)
  .merge('order.', orderRouter)

export type AppRouter = typeof appRouter
