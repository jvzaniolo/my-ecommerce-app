import type { NextPage } from 'next'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button, Center, Container, Flex, Heading } from '@chakra-ui/react'
import Input from '~/components/input'
import { useUser } from '~/contexts/user'

type SignUpFormData = {
  email: string
  password: string
  confirmPassword: string
}

const signUpSchema = yup.object({
  email: yup.string().email('Email is invalid').required('Email is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
})

const SignUp: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
  })
  const { signUp } = useUser()

  const onSignUp: SubmitHandler<SignUpFormData> = async data => {
    const { email, password } = data

    await signUp(email, password)
  }

  return (
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
  )
}

export default SignUp
