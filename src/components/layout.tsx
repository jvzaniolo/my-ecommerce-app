import { Box, Flex, Text } from '@chakra-ui/react'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Flex
        as="header"
        p="4"
        h="14"
        shadow="base"
        align="center"
        justify="space-between"
      >
        <Text fontWeight="semibold">My E-Commerce App</Text>
      </Flex>
      <Box as="main" p="4">
        {children}
      </Box>
    </>
  )
}
