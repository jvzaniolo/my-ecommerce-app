export type Product = {
  id: string
  name: string
  price: number
  stock: number
  slug: string
  image_url: string
  description: string
  created_at: string
}

export type Cart = {
  id: string
  items: {
    id: string
    product_id: string
    product: Product
    quantity: number
    created_at: string
  }[]
  created_at: string
}

export type Order = {
  id: string
  items: {
    id: string
    product: Product
    quantity: number
    created_at: string
  }[]
  user: {
    email: string
    created_at: string
  }
  total: number
  created_at: string
}

export interface CheckoutFormData {
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
    isSameAsShipping: boolean
  }
  payment: {
    cvv: string
    expiry: string
    cardNumber: string
  }
}
