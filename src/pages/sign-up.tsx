import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  useToast,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextPage } from 'next'
import Head from 'next/head'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '~/components/input'

const signUpSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Email is invalid'),
    password: z.string().min(1, 'Password is required'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type SignUpFormData = z.infer<typeof signUpSchema>

const SignUp: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })
  const toast = useToast()

  const onSignUp: SubmitHandler<SignUpFormData> = async data => {
    try {
      const { email, password } = data

      await supabaseClient.auth.signUp({ email, password })
      reset()
    } catch (error: any) {
      toast({
        title: 'Sign In',
        description: error.message,
        status: 'error',
        duration: 5000,
      })
    }
  }

  return (
    <>
      <Head>
        <title>My E-Com | Sign Up</title>
      </Head>

      <Center>
        <Container maxW="container.sm">
          <Heading mb="6">Sign Up</Heading>

          <Flex
            direction="column"
            gap="3"
            as="form"
            onSubmit={handleSubmit(onSignUp)}
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
            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <Button
              mt="6"
              w="full"
              type="submit"
              colorScheme="purple"
              isLoading={isSubmitting}
            >
              Sign Up
            </Button>
          </Flex>
        </Container>
      </Center>
    </>
  )
}

export default SignUp
