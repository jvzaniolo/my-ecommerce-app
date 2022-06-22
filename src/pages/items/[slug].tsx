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
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import useSWR, { SWRConfiguration, useSWRConfig } from 'swr'
import { Quantity } from '~/components/quantity'
import { useCartDrawer } from '~/contexts/cart-drawer'
import { axios } from '~/services/axios'
import { toUSCurrency } from '~/utils/format'

const Item: NextPage<{ fallback: SWRConfiguration['fallback'] }> = ({
  fallback,
}) => {
  const [quantity, setQuantity] = useState(1)
  const toast = useToast()
  const { query } = useRouter()
  const { mutate } = useSWRConfig()
  const { onOpenCartDrawer } = useCartDrawer()
  const { data: item } = useSWR(`/api/products/${query.slug}`, { fallback })
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  async function onAddToCart() {
    try {
      await axios.post(`/api/cart`, {
        productId: item.id,
        quantity,
      })

      mutate('/api/cart')

      toast({
        title: 'Added to cart',
        description: `${item?.name} has been added to your cart`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      onOpenCartDrawer()
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: `${item?.name} was not added to your cart`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

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
                src={item.image}
                alt={item.name}
                objectFit="cover"
              />
            </AspectRatio>
          </Box>
          <Flex
            as="form"
            flex="2"
            direction="column"
            gap="3"
            onSubmit={handleSubmit(onAddToCart)}
          >
            <Flex justify="space-between">
              <Heading as="h2">{item.name}</Heading>
              <Heading as="h3">{toUSCurrency(item.price)}</Heading>
            </Flex>
            <Text>In-Stock: {item.stock}</Text>
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
                isLoading={isSubmitting}
                leftIcon={<MdOutlineAddShoppingCart />}
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

export const getServerSideProps: GetServerSideProps = async context => {
  const slug = context.query.slug as string
  const { data } = await axios.get(`/api/products/${slug}`)

  return {
    props: {
      fallback: {
        [`/api/products/${slug}`]: data,
      },
    },
  }
}

export default Item
