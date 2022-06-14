import type { GetServerSideProps, NextPage } from 'next'
import type { Item } from '~/types/item'
import type { Fallback } from '~/types/swr'

import NextLink from 'next/link'
import NextImage from 'next/image'
import useSWR from 'swr'
import {
  AspectRatio,
  Box,
  Center,
  Heading,
  Img,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react'
import { fetcher } from '~/services/fetcher'
import { toUSCurrency } from '~/utils/format'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage<{ fallback: Fallback }> = ({ fallback }) => {
  const toast = useToast()
  const router = useRouter()

  useEffect(() => {
    if (router.query.error) {
      toast({
        title: 'Error',
        description: 'Your cart is empty',
        status: 'error',
        duration: 5000,
      })
      router.replace('/')
    }
  }, [router, toast])

  const { data: items } = useSWR<Item[]>(
    '/api/products',
    () => fetcher('http://localhost:3000/api/products'),
    { fallback }
  )

  return items && items.length > 0 ? (
    <SimpleGrid
      gap="4"
      templateColumns={{
        base: 'repeat(auto-fit, minmax(250px, 1fr))',
        lg: 'repeat(auto-fit, minmax(300px, 0fr))',
      }}
    >
      {items?.map(item => (
        <LinkBox key={item.id} shadow="md" overflow="hidden" borderRadius="lg">
          <AspectRatio ratio={4 / 3}>
            <Img
              as={NextImage}
              src={item.image}
              alt={item.name}
              layout="fill"
              objectFit="cover"
            />
          </AspectRatio>
          <Box p={3}>
            <Heading as="h2" size="sm" fontWeight="medium">
              <NextLink href={`/items/${item.slug}`} passHref>
                <LinkOverlay>{item.name}</LinkOverlay>
              </NextLink>
            </Heading>
            <Text fontSize="xl" fontWeight="bold">
              {toUSCurrency(item.price)}
            </Text>
            <Text mt="3" noOfLines={3}>
              {item.description}
            </Text>
          </Box>
        </LinkBox>
      ))}
    </SimpleGrid>
  ) : (
    <Center>
      <Text>There are no items yet.</Text>
    </Center>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await fetcher<Item[]>('http://localhost:3000/api/products')

  return {
    props: {
      fallback: {
        '/api/products': data,
      },
    },
  }
}

export default Home
