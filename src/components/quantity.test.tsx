import { render } from '@testing-library/react'
import { Quantity } from './quantity'

describe('Quantity', () => {
  it('should render the quantity with initial props', () => {
    const { container } = render(
      <Quantity value={1} onChange={() => {}} max={100} />
    )

    expect(container).toMatchSnapshot()
  })

  it('should increase the quantity when the increase button is clicked', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <Quantity value={1} onChange={onChange} max={100} />
    )

    const increaseButton = getByTestId('increase-quantity')
    increaseButton.click()

    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('should decrease the quantity when the decrease button is clicked', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <Quantity value={2} onChange={onChange} max={100} />
    )

    const decreaseButton = getByTestId('decrease-quantity')
    decreaseButton.click()

    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('should not increase more than the maxQuantity value', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <Quantity value={1} onChange={onChange} max={1} />
    )

    const increaseButton = getByTestId('increase-quantity')
    increaseButton.click()

    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('should not decrease to less than one', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <Quantity value={1} onChange={onChange} max={100} />
    )

    const decreaseButton = getByTestId('decrease-quantity')
    decreaseButton.click()

    expect(onChange).toHaveBeenCalledWith(1)
  })
})
