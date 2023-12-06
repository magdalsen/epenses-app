import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useDisclosure } from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react"
import { useForm } from "react-hook-form";
import { months } from "./constans/constans";
import { supabase } from "../supabaseClient";
import { useUserContext } from "../context/UserContext";
import { schemaAddMonth } from "./validation/validation";

interface AddMonthData {
    month: string;
    income: number;
}

export const AddMonthModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { userId }=useUserContext();
    const todayDate = new Date().getFullYear();
  
    const initialRef = React.useRef(null);

    const addMonth = async (values:AddMonthData) => {
        const dbData: (string | string[])[] = [];
        const valuesData = (values.month).concat(todayDate.toString());
        const { data, error } = await supabase
        .from('income')
        .select('incomeId, monthName, year')
        if (error) throw error;
        data.map(async (el: { monthName: string; year: number; })=>{
            dbData.push((el.monthName).concat(el.year.toString()));
        })
        const check = dbData.includes(valuesData);
        if (check) {
            alert('Month already exist!');
            return
        } else {
            const { data2, error2 } = await supabase
                .from('income')
                .insert([
                  { id: userId, incomeId: data.length+1, monthIncome: values.income, monthName: values.month, year: new Date().getFullYear() }
                ])
                if (error2) throw error2;
                alert('Month added!');
                return data2;
        }
    }

    const { register, handleSubmit, formState: { errors } } = useForm<AddMonthData>({
        defaultValues: {
          income: 0,
          month: '',
        },
        resolver: yupResolver(schemaAddMonth)
      });
      const onSubmit = (data: AddMonthData) => {
        addMonth(data);
      }
  
    return (
      <>
        <Button onClick={onOpen}>Add month</Button>
  
        <Modal
          initialFocusRef={initialRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add month</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <FormLabel>Month:</FormLabel>
                        <Select {...register("month")} placeholder='Select option'>
                            {months.map((el)=>(
                                <option key={el.month} value={el.month}>{el.month}</option>
                            ))}
                        </Select>
                        <p>{errors.month?.message}</p>
                    </FormControl>
                    
                    <FormControl>
                        <FormLabel>Income in zł:</FormLabel>
                        <Input {...register("income")} type="number" placeholder="Income" />
                        <p>{errors.income?.message}</p>
                    </FormControl>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} variant='solid' type="submit">
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  }