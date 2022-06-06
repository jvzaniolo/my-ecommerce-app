import type { UseFormRegister } from 'react-hook-form'
import type { FormData } from '~/types/checkout-form'

import { Heading, Stack } from '@chakra-ui/react'
import Input from './input'

const ShippingForm = ({
  register,
}: {
  register: UseFormRegister<FormData>
}) => {
  return (
    <>
      <Heading as="h2" size="lg">
        Shipping
      </Heading>

      <Stack mt="3">
        <Input label="E-mail" type="email" {...register('shipping.email')} />
        <Stack direction="row">
          <Input
            label="First name"
            type="text"
            {...register('shipping.firstName')}
          />
          <Input
            label="Last name"
            type="text"
            {...register('shipping.lastName')}
          />
        </Stack>
        <Input label="Address" type="text" {...register('shipping.address')} />
        <Input
          label="Secondary Address"
          type="text"
          {...register('shipping.secondaryAddress')}
        />

        <Stack direction="row">
          <Input label="City" type="text" {...register('shipping.city')} />
          <Input label="State" type="text" {...register('shipping.state')} />
        </Stack>
        <Stack direction="row">
          <Input
            label="Country"
            type="text"
            {...register('shipping.country')}
          />
          <Input
            label="Zip Code"
            type="text"
            {...register('shipping.zipCode')}
          />
        </Stack>
        <Input label="Phone" type="text" {...register('shipping.phone')} />
      </Stack>
    </>
  )
}

export default ShippingForm
