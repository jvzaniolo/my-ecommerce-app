import { useRouter } from 'next/router'
import { Heading, Img, Stack, Text } from '@chakra-ui/react'
import type { Item as ItemProps } from '~/types/item'

export function Item({ id, name, description, price, image }: ItemProps) {
  const { push } = useRouter()

  function handleClick() {
    push(`/items/${id}`)
  }

  return (
    <Stack as="button" cursor="pointer" onClick={handleClick}>
      <Img src={image} alt={name} w="40" />
      <Heading size="sm">{name}</Heading>
      <Text>{description}</Text>
      <Text>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(price)}
      </Text>
    </Stack>
  )
}
