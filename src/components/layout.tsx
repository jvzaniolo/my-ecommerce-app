import {
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import { useUser } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { FC, ReactNode } from 'react'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { useCartDrawer } from '~/contexts/cart-drawer'

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser()
  const { onOpenCartDrawer } = useCartDrawer()

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

            <HStack>
              <IconButton
                onClick={onOpenCartDrawer}
                aria-label="cart"
                icon={<MdOutlineShoppingCart />}
              />

              {user ? (
                <Button
                  colorScheme="purple"
                  onClick={() => supabaseClient.auth.signOut()}
                >
                  Sign Out
                </Button>
              ) : (
                <Link href="/sign-in" passHref>
                  <Button as="a" colorScheme="purple">
                    Sign In
                  </Button>
                </Link>
              )}
            </HStack>
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
    </Grid>
  )
}
