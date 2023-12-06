import { Button } from "@chakra-ui/react";

export const SubmitButton = ({value}:{value: {variant: string; text: string}}) => {
    return (
        <Button colorScheme='blue' variant={value.variant} type="submit">{value.text}</Button>
    )
}

export const ConfirmButton = ({value}:{value: {variant: string; text: string}}) => {
    return (
        <Button colorScheme='blue' variant={value.variant} type="button">{value.text}</Button>
    )
}

export const BackButton = ({value}:{value: {variant: string; text: string}}) => {
    return (
        <Button colorScheme='blue' variant={value.variant} type="button">{value.text}</Button>
    )
}

export const SaveButton = ({value}:{value: {variant: string; text: string}}) => {
    return (
        <Button colorScheme='blue' mr={3} variant={value.variant} type="submit">{value.text}</Button>
    )
}
