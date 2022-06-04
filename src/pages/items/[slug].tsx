import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import { api } from '~/services/axios'
import { Item as ItemComponent } from '~/components/item'
import type { Fallback } from '~/types/swr'

const Item: NextPage<{ fallback: Fallback }> = ({ fallback }) => {
  const router = useRouter()
  const { slug } = router.query

  return (
    <SWRConfig value={{ fallback }}>
      <ItemComponent slug={slug} />
    </SWRConfig>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { slug } = context.query
  const { data } = await api.get('/items', {
    params: {
      slug,
    },
  })

  return {
    props: {
      fallback: {
        [`/items/${slug}`]: data,
      },
    },
  }
}

export default Item
