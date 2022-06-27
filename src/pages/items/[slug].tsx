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
import { mutate } from 'swr'
import { Quantity } from '~/components/quantity'
import { useCartDrawer } from '~/contexts/cart-drawer'
import { appRouter } from '~/server/routers/_app'
import { supabase } from '~/server/supabase'
import { Product } from '~/types'
import { axios } from '~/utils/axios'
import { toUSCurrency } from '~/utils/format'
import { trpc } from '~/utils/trpc'

const Item: NextPage<{ product: Product }> = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const toast = useToast()
  const slug = useRouter().query.slug as string
  const { onOpenCartDrawer } = useCartDrawer()
  const { data: item, error } = trpc.useQuery(['product.bySlug', { slug }], {
    initialData: product,
  })

  async function onAddToCart() {
    if (!item) return

    try {
      await axios.post(`/api/cart`, {
        productId: item.id,
        quantity,
      })

      mutate('/api/cart')

      onOpenCartDrawer()
    } catch (error) {
      toast({
        title: 'Error while adding to cart',
        description: `${item.name} was not added to your cart`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
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
                  src={item.image_url}
                  alt={item.name}
                  objectFit="cover"
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
  const { data } = await supabase.from('product').select('slug')

  if (!data) throw new Error('No products found')

  return {
    paths: data.map(product => ({
      params: {
        slug: product.slug,
      },
    })),
    fallback: false,
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
      slug,
    },
  }
}

export default Item
