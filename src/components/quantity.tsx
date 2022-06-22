import {
  HStack,
  Icon,
  IconButton,
  Input,
  useNumberInput,
} from '@chakra-ui/react'
import { FC } from 'react'
import { MdAdd, MdRemove } from 'react-icons/md'

type QuantityProps = {
  max: number
  value: number
  onChange: (value: number) => void
}

export const Quantity: FC<QuantityProps> = ({ max, value, onChange }) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      min: 1,
      max,
      value,
      onChange: (_, number) => {
        onChange(number)
      },
    })

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  return (
    <HStack>
      <IconButton
        icon={<Icon as={MdRemove} />}
        aria-label="Decrease"
        data-testid="decrease-quantity"
        {...dec}
      />
      <Input type="number" name="quantity" {...input} />
      <IconButton
        icon={<Icon as={MdAdd} />}
        aria-label="Increase"
        data-testid="increase-quantity"
        {...inc}
      />
    </HStack>
  )
}
