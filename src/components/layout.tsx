import Link from 'next/link'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { Box, Flex, Heading, Icon, IconButton } from '@chakra-ui/react'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex h="100vh" direction="column">
      <Flex as="header" shadow="base">
        <Flex
          p="3"
          w="container.xl"
          mx="auto"
          align="center"
          justify="space-between"
        >
          <Heading size="sm">My E-Commerce App</Heading>

          <Link href="/cart" passHref>
            <IconButton
              as="a"
              aria-label="cart"
              icon={<Icon as={MdOutlineShoppingCart} />}
            />
          </Link>
        </Flex>
      </Flex>

      <Box as="main" p="4" h="full" w="container.xl" mx="auto">
        {children}
      </Box>
    </Flex>
  )
}
