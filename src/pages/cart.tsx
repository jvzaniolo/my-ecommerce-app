import type { GetServerSideProps, NextPage } from 'next'
import type { Fallback } from '~/types/swr'

import { SWRConfig } from 'swr'
import api from '~/services/axios'
import Cart from '~/components/cart'

const CartPage: NextPage<{ fallback: Fallback }> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Cart />
    </SWRConfig>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get('/cart')

  return {
    props: {
      fallback: {
        '/cart': data,
      },
    },
  }
}

export default CartPage
