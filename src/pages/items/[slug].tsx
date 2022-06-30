import {
  AspectRatio,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  Flex,
  Heading,
  Img,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { createSSGHelpers } from '@trpc/react/ssg'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import { Quantity } from '~/components/quantity'
import { useCartDrawer } from '~/contexts/cart-drawer'
import { prisma } from '~/server/prisma'
import { appRouter } from '~/server/routers/_app'
import { toUSCurrency } from '~/utils/format'
import { trpc } from '~/utils/trpc'

const Item: NextPage = () => {
  const slug = useRouter().query.slug as string
  const toast = useToast()
  const { onOpenCartDrawer } = useCartDrawer()
  const [quantity, setQuantity] = useState(1)
  const { data: item, error } = trpc.useQuery(['product.bySlug', { slug }])
  const utils = trpc.useContext()
  const mutation = trpc.useMutation(['cart.add-item'])

  function onAddToCart() {
    if (!item) return

    mutation.mutate(
      {
        productId: item.id,
        quantity,
      },
      {
        async onSuccess() {
          await utils.refetchQueries(['cart.all'])
          onOpenCartDrawer()
        },
        onError() {
          toast({
            title: 'Error while adding to cart',
            description: `${item.name} was not added to your cart`,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        },
      }
    )
  }

  if (item) {
    return (
      <>
        <Head>
          <title>{item.name}</title>
        </Head>

        <Flex h="full" direction="column">
          <Breadcrumb mb="4">
            <BreadcrumbItem>
              <Link href="/" passHref>
                <BreadcrumbLink>Home</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{item.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Flex h="full" gap="14" wrap="wrap">
            <Box flex="3">
              <AspectRatio minW="300" h="100%" ratio={16 / 9}>
                <Img
                  as={Image}
                  layout="fill"
                  src={item.imageUrl}
                  alt={item.name}
                  objectFit="cover"
                  priority
                />
              </AspectRatio>
            </Box>
            <Flex gap="3" flex="2" direction="column">
              <Flex justify="space-between">
                <Heading as="h2">{item.name}</Heading>
                <Heading as="h3">{toUSCurrency(item.price)}</Heading>
              </Flex>
              <Text>{item.stock > 0 ? 'In stock' : 'Out of stock'}</Text>
              <Divider />
              <Text>{item.description}</Text>

              <Stack mt="8">
                <Quantity
                  max={item.stock}
                  value={quantity}
                  onChange={value => setQuantity(value)}
                />

                <Button
                  w="full"
                  type="submit"
                  colorScheme="purple"
                  isLoading={mutation.isLoading}
                  leftIcon={<MdOutlineAddShoppingCart />}
                  onClick={onAddToCart}
                >
                  Add to cart
                </Button>
              </Stack>
            </Flex>
          </Flex>
        </Flex>
      </>
    )
  }

  if (error) return <>{error.message}</>

  return <>Loading...</>
}

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await prisma.product.findMany()

  return {
    paths: products.map(product => ({
      params: {
        slug: product.slug,
      },
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async context => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: {},
  })

  const slug = context.params?.slug as string

  await ssg.fetchQuery('product.bySlug', {
    slug,
  })

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },

    revalidate: 60 * 60 * 24 * 7,
  }
}

export default Item
