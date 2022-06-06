export interface FormData {
  shipping: {
    email: string
    firstName: string
    lastName: string
    address: string
    secondaryAddress: string
    city: string
    state: string
    country: string
    zipCode: string
    phone: string
  }
  billing: {
    address: string
    secondaryAddress: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  payment: {
    cardNumber: string
    expiry: string
    cvv: string
  }
}
