import type { AppProps } from 'next/app'

import { ChakraProvider } from '@chakra-ui/react'
import Layout from '~/components/layout'
import { CartDrawerProvider } from '~/contexts/cart-drawer'
import { UserProvider } from '~/contexts/user'

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
