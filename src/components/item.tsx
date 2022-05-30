import Link from 'next/link'
import { Heading, Img, Stack, Text } from '@chakra-ui/react'
import type { Item as ItemProps } from '~/types/item'

export function Item({ id, name, description, price, image }: ItemProps) {
  return (
    <Link href={`/items/${id}`} passHref>
      <Stack as="a">
        <Img src={image} alt={name} w="64" />
        <Heading size="sm">{name}</Heading>
        <Text>{description}</Text>
        <Text>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(price)}
        </Text>
      </Stack>
    </Link>
  )
}
