import type { ReactNode } from 'react'

import Link from 'next/link'
import { MdOutlineShoppingCart } from 'react-icons/md'
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Spacer,
  Text,
} from '@chakra-ui/react'

const Layout = ({ children }: { children: ReactNode }) => {
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
            <Link href="/cart" passHref>
              <IconButton
                as="a"
                aria-label="cart"
                icon={<MdOutlineShoppingCart />}
              />
            </Link>
          </Flex>
        </Container>
      </GridItem>

      <GridItem as="main">
        <Container maxW="container.xl" flexGrow="1">
          <Flex p="2">{children}</Flex>
        </Container>
      </GridItem>

      <GridItem as="footer" borderTop="1px solid" borderColor="blackAlpha.200">
        <Container p="8" maxW="container.xl" centerContent>
          <Text color="blackAlpha.800" size="sm">
            Made with 💜 by @jvzaniolo | Copyright © 2022
          </Text>
        </Container>
      </GridItem>
    </Grid>
  )
}

export default Layout
