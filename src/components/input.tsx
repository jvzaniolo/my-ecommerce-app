import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  forwardRef,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react'

interface InputProps extends ChakraInputProps {
  label?: string
  helper?: string
  error?: string
}

export const Input = forwardRef<InputProps, 'input'>(
  ({ id, isRequired, helper, error, label, ...rest }, ref) => (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
      <ChakraInput ref={ref} name={id} {...rest} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
)
