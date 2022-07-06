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
import { createSSGHelpers } from '@trpc/react/ssg'
import { NextPage } from 'next'
import Head from 'next/head'
import NextImage from 'next/image'
import NextLink from 'next/link'
import superjson from 'superjson'
import { createContext } from '~/server/context'
import { appRouter } from '~/server/routers/_app'
import { toUSCurrency } from '~/utils/format'
import { trpc } from '~/utils/trpc'

export const getStaticProps = async () => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: createContext,
    transformer: superjson,
  })

  await ssg.fetchQuery('product.all')

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },

    revalidate: 60 * 60 * 24 * 7, // 1 week
  }
}

const Home: NextPage = () => {
  const { data: items, error } = trpc.useQuery(['product.all'])

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
            {items.map(item => (
              <LinkBox
                key={item.id}
                shadow="md"
                overflow="hidden"
                borderRadius="lg"
              >
                <AspectRatio ratio={4 / 3}>
                  <Img
                    as={NextImage}
                    src={item.imageUrl}
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

export default Home
