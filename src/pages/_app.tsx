import { ChakraProvider } from '@chakra-ui/react'
import { withTRPC } from '@trpc/next'
import { AppProps } from 'next/app'
import { ReactQueryDevtools } from 'react-query/devtools'
import superjson from 'superjson'
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

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return ''
  }
  if (process.browser) return '' // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`

    return {
      url,
      transformer: superjson,
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
