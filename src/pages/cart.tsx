import { SWRConfig } from 'swr'
import { api } from '~/services/axios'
import { Cart as CartComponent } from '~/components/cart'

import type { GetServerSideProps, NextPage } from 'next'
import type { Fallback } from '~/types/swr'

const Cart: NextPage<{ fallback: Fallback }> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <CartComponent />
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

export default Cart
