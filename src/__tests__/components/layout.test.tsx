import { render } from '@testing-library/react'
import Layout from '~/components/layout'

describe('Layout', () => {
  it('should render the Layout and its content', () => {
    const { container } = render(<Layout>test</Layout>)

    expect(container).toMatchSnapshot()
  })
})
