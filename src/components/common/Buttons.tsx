import { Button } from "@chakra-ui/react";

export const SubmitButton = ({value}:{value: {variant: string; text: string; colorScheme: string;}}) => {
    return (
        <Button colorScheme={value.colorScheme} variant={value.variant} type="submit">{value.text}</Button>
    )
}

export const ConfirmButton = ({value}:{value: {variant: string; text: string; colorScheme: string;}}) => {
    return (
        <Button colorScheme={value.colorScheme} variant={value.variant} type="button">{value.text}</Button>
    )
}

export const BackButton = ({value}:{value: {variant: string; text: string; colorScheme: string;}}) => {
    return (
        <Button colorScheme={value.colorScheme} variant={value.variant} type="button">{value.text}</Button>
    )
}

export const SaveButton = ({value}:{value: {variant: string; text: string; colorScheme: string;}}) => {
    return (
        <Button colorScheme={value.colorScheme} mr={3} variant={value.variant} type="submit">{value.text}</Button>
    )
}
