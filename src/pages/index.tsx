import type { GetServerSideProps, NextPage } from 'next'
import { Flex, Text } from '@chakra-ui/react'
import { api } from '~/services/axios'
import { Item } from '~/components/item'
import type { Item as ItemType } from '~/types/item'

const Home: NextPage<{ items: ItemType[] }> = ({ items }) => {
  return (
    <Flex gap="4" flexWrap="wrap">
      {items.length > 0 ? (
        items.map(item => <Item key={item.id} {...item} />)
      ) : (
        <Text>There are no items yet.</Text>
      )}
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get('/api/items')

  return {
    props: {
      items: data || [],
    },
  }
}

export default Home
