import {
  forwardRef,
  Input as ChakraInput,
  FormControl,
  FormErrorMessage,
  FormLabel,
  type InputProps as ChakraInputProps,
} from '@chakra-ui/react'

interface InputProps extends ChakraInputProps {
  label?: string
  helper?: string
  error?: string
}

const Input = forwardRef<InputProps, 'input'>(
  ({ id, isRequired, helper, error, label, ...rest }, ref) => (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
      <ChakraInput ref={ref} name={id} {...rest} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
)

export default Input
