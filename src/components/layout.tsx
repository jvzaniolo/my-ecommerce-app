import Link from 'next/link'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { Box, Button, Flex, Icon, IconButton } from '@chakra-ui/react'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex h="100vh" direction="column">
      <Flex
        as="header"
        p="4"
        h="14"
        shadow="base"
        align="center"
        justify="space-between"
      >
        <Link href="/" passHref>
          <Button as="a" variant="ghost">
            My E-Commerce App
          </Button>
        </Link>

        <Flex align="center">
          <Link href="/cart" passHref>
            <IconButton
              as="a"
              icon={<Icon as={MdOutlineShoppingCart} />}
              aria-label="cart"
            />
          </Link>
        </Flex>
      </Flex>
      <Box as="main" p="4" h="full">
        {children}
      </Box>
    </Flex>
  )
}
