import Link from 'next/link'
import { Flex, Heading, Img, Text } from '@chakra-ui/react'
import type { Item as ItemProps } from '~/types/item'

export function Item({ slug, name, description, price, image }: ItemProps) {
  return (
    <Link href={`/items/${slug}`} passHref>
      <Flex as="a" direction="column" shadow="md" maxW="72">
        <Img src={image} alt={name} w="72" borderTopRadius="md" />
        <Flex p="3" gap="3" flex="1" direction="column" borderBottomRadius="md">
          <Heading size="sm">{name}</Heading>
          <Text noOfLines={3}>{description}</Text>
          <Text mt="auto" fontWeight="bold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(price)}
          </Text>
        </Flex>
      </Flex>
    </Link>
  )
}
