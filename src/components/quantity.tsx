import { MdAdd, MdRemove } from 'react-icons/md'
import {
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react'

export function Quantity({
  value,
  onChange,
  maxQuantity,
}: {
  value: number
  onChange(value: number): void
  maxQuantity: number
}) {
  function onIncrease() {
    if (value < maxQuantity) {
      onChange(value + 1)
    } else {
      onChange(value)
    }
  }

  function onDecrease() {
    if (value > 1) {
      onChange(value - 1)
    } else {
      onChange(value)
    }
  }

  return (
    <InputGroup>
      <InputLeftElement>
        <IconButton
          size="sm"
          icon={<Icon as={MdRemove} />}
          aria-label="Decrease"
          onClick={onDecrease}
          data-testid="decrease-quantity"
        />
      </InputLeftElement>
      <Input type="number" name="quantity" value={value} onChange={() => {}} />
      <InputRightElement>
        <IconButton
          size="sm"
          icon={<Icon as={MdAdd} />}
          aria-label="Increase"
          onClick={onIncrease}
          data-testid="increase-quantity"
        />
      </InputRightElement>
    </InputGroup>
  )
}
