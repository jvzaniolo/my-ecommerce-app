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
import { AxiosError } from 'axios'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import NextImage from 'next/image'
import NextLink from 'next/link'
import useSWR from 'swr'
import { axios, fetcher } from '~/services/axios'
import { Product } from '~/types'
import { toUSCurrency } from '~/utils/format'

const Home: NextPage<{ products: Product[] }> = ({ products }) => {
  const { data: items, error } = useSWR<Product[], AxiosError>(
    '/api/products',
    fetcher,
    {
      fallbackData: products,
    }
  )

  if (items) {
    return (
      <>
        <Head>
          <title>My E-Com | Home</title>
        </Head>

        {items.length > 0 ? (
          <SimpleGrid
            gap="4"
            templateColumns={{
              base: 'repeat(auto-fit, minmax(250px, 1fr))',
              lg: 'repeat(auto-fit, minmax(300px, 0fr))',
            }}
          >
            {items.map((item: any) => (
              <LinkBox
                key={item.id}
                shadow="md"
                overflow="hidden"
                borderRadius="lg"
              >
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
        )}
      </>
    )
  }

  if (error) return <>{error.message}</>

  return <>Loading...</>
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: products } = await axios.get('/api/products')

  return {
    props: {
      products,
    },
  }
}

export default Home
