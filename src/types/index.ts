export type Product = {
  id: string
  name: string
  price: number
  stock: number
  slug: string
  image: { publicURL: string }
  description: string
}

export type Cart = {
  id: string
  items: {
    id: string
    product_id: string
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
