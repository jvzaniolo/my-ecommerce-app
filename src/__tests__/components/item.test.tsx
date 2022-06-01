import { render } from '@testing-library/react'
import { Item } from '~/components/item'
import type { Item as ItemType } from '~/types/item'

const item: ItemType = {
  id: '1',
  slug: 'slug',
  name: 'name',
  description: 'description',
  image: 'image',
  price: 20.0,
  quantity: 1,
}

describe('Item', () => {
  it('should render an item with initial props', () => {
    const { container } = render(<Item {...item} />)

    expect(container).toMatchSnapshot()
  })
})
