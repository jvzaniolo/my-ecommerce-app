import { ChakraProvider } from '@chakra-ui/react'
import { withTRPC } from '@trpc/next'
import { AppProps } from 'next/app'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Layout } from '~/components/layout'
import { CartDrawerProvider } from '~/contexts/cart-drawer'
import { UserProvider } from '~/contexts/user'
import { AppRouter } from '~/server/routers/_app'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <CartDrawerProvider>
        <UserProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserProvider>
      </CartDrawerProvider>

      <ReactQueryDevtools />
    </ChakraProvider>
  )
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000'

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp)
