import Link from 'next/link'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { Box, Flex, Heading, Icon, IconButton } from '@chakra-ui/react'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Box as="header" shadow="base">
        <Flex
          p="3"
          maxW="container.xl"
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
      </Box>

      <Box as="main" p="4" h="full" maxW="container.xl" mx="auto">
        {children}
      </Box>
    </>
  )
}
