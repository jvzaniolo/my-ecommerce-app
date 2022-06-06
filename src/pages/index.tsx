import type { GetServerSideProps, NextPage } from 'next'
import type { Item } from '~/types/item'
import type { Fallback } from '~/types/swr'

import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import { Box, Flex, Heading, Img, Text } from '@chakra-ui/react'
import api, { fetcher } from '~/services/axios'
import { toUSCurrency } from '~/utils/format'

const Home: NextPage<{ fallback: Fallback }> = ({ fallback }) => {
  const { data: items } = useSWR<Item[]>('/items', fetcher, fallback)

  return (
    <Box w="full">
      <Flex gap="4" flexWrap="wrap">
        {items && items.length > 0 ? (
          items?.map(item => (
            <Link key={item.id} href={`/items/${item.slug}`} passHref>
              <Flex as="a" direction="column" shadow="md" maxW="72">
                <Box h="64" pos="relative">
                  <Img
                    as={Image}
                    src={item.image}
                    alt={item.name}
                    layout="fill"
                    borderTopRadius="md"
                  />
                </Box>
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
    </Box>
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
