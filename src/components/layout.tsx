import Link from 'next/link'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { Box, Button, Flex, Icon, IconButton } from '@chakra-ui/react'

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
      </Flex>
      <Box as="main" p="4" h="full" w="container.xl" mx="auto">
        {children}
      </Box>
    </Flex>
  )
}
