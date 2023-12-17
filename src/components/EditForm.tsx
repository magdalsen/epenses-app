import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AddExpenseData, ExpensesData } from "./constans/types";
import { yupResolver } from "@hookform/resolvers/yup";
import style from './ExpenseDetails.module.css';
import { schemaAddExpense } from "./validation/validation";
import { fetchDataByRow, handleDelete, updateExpense } from "../api/api";
import { useUserContext } from "../context/UserContext";
import { createPureMonthAndYearDataFormat, expensesGetYear } from "./utils/utils";
import { Button } from "@chakra-ui/react";
import { SubmitButton } from "./common/Buttons";
import { buttonData } from "./constans/constans";
import { InputField } from "./common/Inputs";
import { useParams } from "react-router-dom";

export const EditForm = () => {
    const [ editExpense, setEditExpens ] = useState('');
    const [ editPrice, setEditPrice] = useState(0);
    const [ editId, setEditId ] = useState('');
    const { userId }=useUserContext();
    const [expenses, setExpenses] = useState([]);
    const {id} = useParams();
    const idFormat = id?.replace('-',' ');

    const productLabelUpdate = editId;

    const { register, handleSubmit } = useForm<AddExpenseData>({
        defaultValues: {
          expense: '',
          price: 0,
        },
        resolver: yupResolver(schemaAddExpense)
      });
    const onEdit = (data: AddExpenseData) => {
        updateExpense(data, editExpense, productLabelUpdate).then((returnedData)=>{
            setEditExpens(returnedData[0].productCategory);
            setEditPrice(returnedData[0].productPrice);
        });
      }

      const inputData = {
        expenseData: {
          type: "text",
          text: "Expense",
          register: {...register("expense")}
        },
        priceData: {
            type: "number",
            text: "Price",
            register: {...register("price")}
          }
      }

    const expensesFilter = () => {
        return expenses.filter((exp:ExpensesData)=>{
            return (createPureMonthAndYearDataFormat(exp)).includes(idFormat);
        }).map((expens:ExpensesData,i)=>{                    
            return (
                <>
                        <div>{i+1}</div>
                        <div>{editExpense === expens.productCategory && editId === expens.productLabel ? <InputField value={inputData.expenseData} /> : expens.productCategory}</div>
                        <div>{editPrice === expens.productPrice && editId === expens.productLabel ? <InputField value={inputData.priceData} /> : expens.productPrice} zł</div>
                        <div>
                            {(editExpense === expens.productCategory || editPrice === expens.productPrice) && editId === expens.productLabel ?
                            <SubmitButton value={buttonData.saveButton} /> :
                            <Button colorScheme="yellow" type="button" onClick={()=>{
                                setEditExpens(expens.productCategory);
                                setEditPrice(expens.productPrice);
                                setEditId(expens.productLabel);
                            }}>Edit</Button>
                            }
                            <Button colorScheme="red" type="button" onClick={()=>handleDelete(expens.productLabel)} >Delete</Button></div>
                </>
            )
        })
    }

    useEffect(()=>{
        fetchDataByRow(userId).then((data)=>{
            setExpenses(expensesGetYear(data));
        });
    },[]);
    
    return (
        <>
            <form onSubmit={handleSubmit(onEdit)} className={style.container}>{expensesFilter()}</form>
        </>
    )
}