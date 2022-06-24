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
} from '@chakra-ui/react'
import { GetServerSideProps, NextPage } from 'next'
import NextImage from 'next/image'
import NextLink from 'next/link'
import useSWR, { SWRConfiguration } from 'swr'
import { axios, fetcher } from '~/services/axios'
import { toUSCurrency } from '~/utils/format'

const Home: NextPage<{ fallback: SWRConfiguration['fallback'] }> = ({
  fallback,
}) => {
  const { data: items } = useSWR('/api/products', fetcher, { fallback })

  return items.length > 0 ? (
    <SimpleGrid
      gap="4"
      templateColumns={{
        base: 'repeat(auto-fit, minmax(250px, 1fr))',
        lg: 'repeat(auto-fit, minmax(300px, 0fr))',
      }}
    >
      {items.map((item: any) => (
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
  const { data } = await axios.get('/api/products')

  return {
    props: {
      fallback: {
        '/api/products': data,
      },
    },
  }
}

export default Home
