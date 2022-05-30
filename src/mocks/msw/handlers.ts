import { rest } from 'msw'

export const handlers = [
  rest.get('http://localhost:3000/api/items/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        name: 'Algum item top',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.',
        image: 'https://via.placeholder.com/800',
        price: 100,
        quantity: 1,
      })
    )
  }),
  rest.get('http://localhost:3000/api/items', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          name: 'Item 1',
          description: 'This is item 1',
          price: 100,
          image: 'https://via.placeholder.com/200',
          quantity: 1,
        },
        {
          id: 2,
          name: 'Item 2',
          description: 'This is item 2',
          price: 200,
          image: 'https://via.placeholder.com/150',
          quantity: 2,
        },
      ])
    )
  }),
]
