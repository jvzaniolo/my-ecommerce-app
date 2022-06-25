export type Product = {
  id: string
  name: string
  price: number
  image: string
  description: string
  stock: number
}

export type Cart = {
  id: string
  items: {
    id: string
    product: Product
    quantity: number
  }[]
}

export type Order = {
  id: string
  items: {
    id: string
    product: Product
    quantity: number
  }[]
  user: {
    email: string
  }
  total: number
}
