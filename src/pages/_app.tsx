import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import { BareFetcher, SWRConfig } from 'swr'
import { Layout } from '~/components/layout'
import { CartDrawerProvider } from '~/contexts/cart-drawer'
import { UserProvider } from '~/contexts/user'
import { axios } from '~/services/axios'

const fetcher: BareFetcher = resource =>
  axios.get(resource).then(res => res.data())

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <CartDrawerProvider>
        <UserProvider>
          <Layout>
            <SWRConfig value={{ fetcher }}>
              <Component {...pageProps} />
            </SWRConfig>
          </Layout>
        </UserProvider>
      </CartDrawerProvider>
    </ChakraProvider>
  )
}

export default MyApp
