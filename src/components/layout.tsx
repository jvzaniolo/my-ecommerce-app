import type { ReactNode } from 'react'

import Link from 'next/link'
import { MdOutlineShoppingCart } from 'react-icons/md'
import {
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import CartDrawer from './cart-drawer'

const Layout = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ id: 'cart' })

  return (
    <Grid h="100vh" templateRows={'auto 1fr auto'}>
      <GridItem
        as="header"
        bg="white"
        top="0"
        pos="sticky"
        shadow="base"
        zIndex="sticky"
      >
        <Container maxW="container.xl">
          <Flex p="2" align="center">
            <Link href="/" passHref>
              <Heading as="a" size="sm">
                My E-Commerce App
              </Heading>
            </Link>
            <Spacer />
            <IconButton
              onClick={onOpen}
              aria-label="cart"
              icon={<MdOutlineShoppingCart />}
            />
          </Flex>
        </Container>
      </GridItem>

      <GridItem as="main">
        <Container h="full" maxW="container.xl" p="4">
          {children}
        </Container>
      </GridItem>

      <GridItem as="footer" borderTop="1px solid" borderColor="blackAlpha.200">
        <Container py="10" maxW="container.xl" centerContent>
          <Text color="blackAlpha.800" size="sm">
            Made with 💜 by @jvzaniolo | Copyright © 2022
          </Text>
        </Container>
      </GridItem>

      <CartDrawer isOpen={isOpen} onClose={onClose} />
    </Grid>
  )
}

export default Layout
