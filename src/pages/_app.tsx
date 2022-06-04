import { SWRConfig } from 'swr'
import { ChakraProvider } from '@chakra-ui/react'
import { Layout } from '~/components/layout'
import { fetcher } from '~/services/axios'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
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
