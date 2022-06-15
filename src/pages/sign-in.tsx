import type { NextPage } from 'next'

import Link from 'next/link'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  useToast,
} from '@chakra-ui/react'
import Input from '~/components/input'
import { useUser } from '~/contexts/user'

type SignUpFormData = {
  email: string
  password: string
}

const signUpSchema = yup.object({
  email: yup.string().email('Email is invalid').required('Email is required'),
  password: yup.string().required('Password is required'),
})

const SignIn: NextPage = () => {
  const {
    register,
    setFocus,
    resetField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
  })
  const toast = useToast()
  const { signIn } = useUser()

  const onSignIn: SubmitHandler<SignUpFormData> = async data => {
    const { email, password } = data

    await signIn(email, password, error => {
      resetField('password')
      setFocus('password')

      toast({
        title: 'Sign In',
        description: error?.message,
        status: 'error',
        duration: 5000,
      })
    })
  }

  return (
    <Center>
      <Container maxW="container.sm">
        <Heading mb="6">Sign In</Heading>

        <Flex
          direction="column"
          gap="3"
          as="form"
          onSubmit={handleSubmit(onSignIn)}
        >
          <Input
            label="E-mail"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />

          <Button
            mt="6"
            w="full"
            type="submit"
            colorScheme="purple"
            isLoading={isSubmitting}
          >
            Sign In
          </Button>

          <Link href="/sign-up" passHref>
            <Button as="a">Don&apos;t have an account yet? Sign up here</Button>
          </Link>
        </Flex>
      </Container>
    </Center>
  )
}

export default SignIn
