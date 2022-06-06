import type { ReactNode } from 'react'

import Link from 'next/link'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { Box, Flex, Heading, Icon, IconButton, Text } from '@chakra-ui/react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Flex direction="column" h="100vh">
      <Box
        as="header"
        top="0"
        pos="sticky"
        flex="0"
        shadow="base"
        zIndex="sticky"
        bgColor="white"
      >
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

      <Flex as="main" p="4" maxW="container.xl" mx="auto" w="full" flex="1">
        {children}
      </Flex>

      <Box
        as="footer"
        p="8"
        w="full"
        mx="auto"
        flex="0"
        textAlign="center"
        maxW="container.xl"
        borderTop="1px solid"
        borderColor="blackAlpha.200"
      >
        <Text color="blackAlpha.800" size="sm">
          Made with 💜 by @jvzaniolo | Copyright © 2022
        </Text>
      </Box>
    </Flex>
  )
}

export default Layout
