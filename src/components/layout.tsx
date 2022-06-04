import type { ReactNode } from 'react'

import Link from 'next/link'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { Box, Flex, Heading, Icon, IconButton } from '@chakra-ui/react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Box as="header" shadow="base">
        <Flex
          p="3"
          mx="auto"
          maxW="container.xl"
          align="center"
          justify="space-between"
        >
          <Link href="/" passHref>
            <Heading as="a" size="sm">
              My E-Commerce App
            </Heading>
          </Link>

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

export default Layout
