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
      <UserProvider>
        <CartDrawerProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CartDrawerProvider>
      </UserProvider>

      <ReactQueryDevtools />
    </ChakraProvider>
  )
}

export default withTRPC<AppRouter>({
  config() {
    if (typeof window !== 'undefined') {
      return {
        url: '/api/trpc',
      }
    }
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc'

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
