import { createRouter } from '../createRouter'
import { productRouter } from './product'
import { userRouter } from './user'

export const appRouter = createRouter()
  .merge('user.', userRouter)
  .merge('product.', productRouter)

export type AppRouter = typeof appRouter
