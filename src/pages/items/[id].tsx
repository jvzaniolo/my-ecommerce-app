import type { GetServerSideProps, NextPage } from 'next'
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import {
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Img,
  Text,
} from '@chakra-ui/react'
import { api } from '~/services/axios'
import type { Item } from '~/types/item'

const ItemDetails: NextPage<{ item: Item }> = ({ item }) => {
  return (
    <Flex gap="4">
      <Img src={item.image} alt={item.name} />
      <Flex gap="3" direction="column">
        <Flex justify="space-between">
          <Heading>{item.name}</Heading>
          <Heading>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(item.price)}
          </Heading>
        </Flex>
        <Text>Quantity: {item.quantity}</Text>
        <Divider />
        <Text>{item.description}</Text>

        <Button mt="8" gap="3">
          <Icon as={MdOutlineAddShoppingCart} />
          Add to cart
        </Button>
      </Flex>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.query
  const { data } = await api.get(`/api/items/${id}`)

  return {
    props: { item: data || {} },
  }
}

export default ItemDetails
