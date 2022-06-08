import * as yup from 'yup'

export const checkoutFormSchema = yup.object({
  shipping: yup.object({
    email: yup.string().required('Email is required').email('Email is invalid'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().required('Zip Code is required'),
    country: yup.string().required('Country is required'),
    phone: yup.string(),
  }),
  billing: yup.object({
    isSameAsShipping: yup.boolean().required('Billing is required'),
  }),
  payment: yup.object({
    cardNumber: yup
      .string()
      .required('Card number is required')
      .length(16, 'Card number is invalid'),
    expiry: yup.string().required('Expiry is required'),
    cvv: yup.string().required('CVV is required').length(3, 'CVV is invalid'),
  }),
})
