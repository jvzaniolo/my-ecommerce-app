import type { AppProps } from 'next/app'

import { ChakraProvider } from '@chakra-ui/react'
import Layout from '~/components/layout'
import { CartDrawerProvider } from '~/contexts/cart-drawer'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <CartDrawerProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartDrawerProvider>
    </ChakraProvider>
  )
}

export default MyApp
