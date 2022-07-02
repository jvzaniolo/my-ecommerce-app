import { Heading, Stack } from '@chakra-ui/react'
import { FC } from 'react'
import { Control, UseFormRegister, useFormState } from 'react-hook-form'
import { CheckoutFormSchema } from '~/pages/checkout'
import { Input } from './input'

type ShippingFormType = {
  control: Control<CheckoutFormSchema>
  register: UseFormRegister<CheckoutFormSchema>
}

export const ShippingForm: FC<ShippingFormType> = ({ register, control }) => {
  const { errors } = useFormState({ control })

  return (
    <>
      <Heading as="h2" size="lg">
        Shipping
      </Heading>

      <Stack mt="3">
        <Input
          label="E-mail"
          type="email"
          {...register('shipping.email')}
          error={errors.shipping?.email?.message}
        />
        <Stack direction="row">
          <Input
            label="First name"
            type="text"
            {...register('shipping.firstName')}
            error={errors.shipping?.firstName?.message}
          />
          <Input
            label="Last name"
            type="text"
            {...register('shipping.lastName')}
            error={errors.shipping?.lastName?.message}
          />
        </Stack>
        <Input
          label="Address"
          type="text"
          {...register('shipping.address')}
          error={errors.shipping?.address?.message}
        />
        <Input
          label="Secondary Address"
          type="text"
          {...register('shipping.secondaryAddress')}
          error={errors.shipping?.secondaryAddress?.message}
        />

        <Stack direction="row">
          <Input
            label="City"
            type="text"
            {...register('shipping.city')}
            error={errors.shipping?.city?.message}
          />
          <Input
            label="State"
            type="text"
            {...register('shipping.state')}
            error={errors.shipping?.state?.message}
          />
        </Stack>
        <Stack direction="row">
          <Input
            label="Country"
            type="text"
            {...register('shipping.country')}
            error={errors.shipping?.country?.message}
          />
          <Input
            label="Zip Code"
            type="text"
            {...register('shipping.zipCode')}
            error={errors.shipping?.zipCode?.message}
          />
        </Stack>
        <Input
          label="Phone"
          type="tel"
          {...register('shipping.phone')}
          error={errors.shipping?.phone?.message}
        />
      </Stack>
    </>
  )
}
