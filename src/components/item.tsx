import Link from 'next/link'
import { Flex, Heading, Img, Stack, Text } from '@chakra-ui/react'
import type { Item as ItemProps } from '~/types/item'

export function Item({ id, name, description, price, image }: ItemProps) {
  return (
    <Link href={`/items/${id}`} passHref>
      <Flex as="a" direction="column">
        <Img src={image} alt={name} w="64" borderTopRadius="md" />
        <Stack shadow="md" p="3" borderBottomRadius="md">
          <Heading size="sm">{name}</Heading>
          <Text>{description}</Text>
          <Text>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(price)}
          </Text>
        </Stack>
      </Flex>
    </Link>
  )
}
