import { SWRConfig } from 'swr'
import type { GetServerSideProps, NextPage } from 'next'
import { api } from '~/services/axios'
import { Items } from '~/components/items'

const Home: NextPage<{ fallback: { [key: string]: unknown | undefined } }> = ({
  fallback,
}) => {
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
