import { Prisma, PrismaClient } from '@prisma/client'
import { v4 as uuidV4 } from 'uuid'

const prisma = new PrismaClient()

const productData: Prisma.ProductCreateInput[] = Array.from({
  length: 100,
}).map((_, i) => ({
  id: uuidV4(),
  description: `Fake description ${i}`,
  imageUrl: 'https://picsum.photos/200/300',
  name: `Fake product ${i}`,
  price: 100,
  stock: 100,
  slug: `fake-product-${i}`,
}))

async function main() {
  console.log('Start seeding ...')

  await prisma.product.createMany({
    data: productData,
  })

  console.log('Seeding finished.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
