import type { AppProps } from 'next/app'

import { SWRConfig } from 'swr'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from '~/components/layout'
import { fetcher } from '~/services/axios'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <Layout>
        <SWRConfig value={{ fetcher }}>
          <Component {...pageProps} />
        </SWRConfig>
      </Layout>
    </ChakraProvider>
  )
}

export default MyApp
