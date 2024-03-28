import { Input } from "@chakra-ui/react"
import { UseFormRegisterReturn } from "react-hook-form";

export const InputField = ({value}:{value: {register: UseFormRegisterReturn; type: string; text: string;}}) => {
    return (
        <Input {...value.register} type={value.type} placeholder={value.text} boxShadow='outline' p='5' rounded='md' bg='white' />
    )
}