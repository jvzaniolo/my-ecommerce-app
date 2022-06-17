import type { AppProps } from 'next/app'

import { ChakraProvider } from '@chakra-ui/react'
import Layout from '~/components/layout'
import { UserProvider } from '~/contexts/user'
import { CartDrawerProvider } from '~/contexts/cart-drawer'

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
    </ChakraProvider>
  )
}

export default MyApp
