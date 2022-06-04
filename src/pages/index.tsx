import { SWRConfig } from 'swr'
import { api } from '~/services/axios'
import { Items } from '~/components/items'

import type { GetServerSideProps, NextPage } from 'next'
import type { Fallback } from '~/types/swr'

const Home: NextPage<{ fallback: Fallback }> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Items />
    </SWRConfig>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get('/items')

  return {
    props: {
      fallback: {
        '/items': data,
      },
    },
  }
}

export default Home
