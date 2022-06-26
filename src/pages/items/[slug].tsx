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
import { AxiosError } from 'axios'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import useSWR, { mutate } from 'swr'
import { Quantity } from '~/components/quantity'
import { useCartDrawer } from '~/contexts/cart-drawer'
import { axios, fetcher } from '~/services/axios'
import { Product } from '~/types'
import { toUSCurrency } from '~/utils/format'

const Item: NextPage<{ product: Product }> = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const toast = useToast()
  const { query } = useRouter()
  const { onOpenCartDrawer } = useCartDrawer()
  const { data: item, error } = useSWR<Product, AxiosError>(
    `/api/products/${query.slug}`,
    fetcher,
    {
      fallbackData: product,
    }
  )

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
                  src={item.image.publicURL}
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

export const getServerSideProps: GetServerSideProps = async context => {
  const slug = context.query.slug as string
  const { data: product } = await axios.get(`/api/products/${slug}`)

  return {
    props: {
      product,
    },
  }
}

export default Item
