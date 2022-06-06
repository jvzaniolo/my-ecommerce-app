import {
  Input as ChakraInput,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  type InputProps as ChakraInputProps,
} from '@chakra-ui/react'
import { forwardRef, type ForwardRefRenderFunction } from 'react'

interface InputProps extends ChakraInputProps {
  label?: string
  helper?: string
  error?: string
}

const _input: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { id, isRequired, isInvalid, helper, error, label, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired}>
      {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
      <ChakraInput ref={ref} name={id} {...rest} />
      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        <FormHelperText>{helper}</FormHelperText>
      )}
    </FormControl>
  )
}

const Input = forwardRef(_input)

export default Input
