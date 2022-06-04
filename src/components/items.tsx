import Link from 'next/link'
import useSWR from 'swr'
import { Flex, Heading, Img, Text } from '@chakra-ui/react'
import { fetcher } from '~/services/axios'
import { toUSCurrency } from '~/utils/format'
import type { Item as ItemType } from '~/types/item'

export function Items() {
  const { data: items } = useSWR<ItemType[]>('/items', fetcher)

  return (
    <Flex gap="4" flexWrap="wrap">
      {items && items.length > 0 ? (
        items?.map(item => (
          <Link key={item.id} href={`/items/${item.slug}`} passHref>
            <Flex as="a" direction="column" shadow="md" maxW="72">
              <Img src={item.image} alt={item.name} w="72" borderTopRadius="md" />
              <Flex
                p="3"
                gap="3"
                flex="1"
                direction="column"
                borderBottomRadius="md"
              >
                <Heading size="sm">{item.name}</Heading>
                <Text noOfLines={3}>{item.description}</Text>
                <Text mt="auto" fontWeight="bold">
                  {toUSCurrency(item.price)}
                </Text>
              </Flex>
            </Flex>
          </Link>
        ))
      ) : (
        <Text>There are no items yet.</Text>
      )}
    </Flex>
  )
}
