import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addExpense, fetchDataByRow, handleDelete, updateExpense } from "../api/api";
import { useUserContext } from "../context/UserContext";
import { createPureMonthAndYearDataFormat, expensesGetYear, productArrayLength } from "./utils/utils";
import { AddExpenseData, ExpensesData } from "./constans/types";
import style from './ExpenseDetails.module.css';
import { ConfirmButton, SubmitButton } from "./common/Buttons";
import { buttonData } from "./constans/constans";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InputField } from "./common/Inputs";
import { schemaAddExpense } from "./validation/validation";
import { Button } from "@chakra-ui/react";

export const ExpenseDetails = () => {
    const { userId }=useUserContext();
    const {id} = useParams();
    const [expenses, setExpenses] = useState([]);
    const idFormat = id?.replace('-',' ');
    const [ editExpense, setEditExpens ] = useState('');
    const [ editPrice, setEditPrice] = useState(0);
    const [ editId, setEditId ] = useState('');

    const addProductArrLength = productArrayLength(expenses, idFormat)[productArrayLength(expenses, idFormat).length-1];
    const productLabelAdd = id + "-" + (addProductArrLength === undefined ? '1' : addProductArrLength);
    const productLabelUpdate = editId;

    const { register, handleSubmit, formState: { errors } } = useForm<AddExpenseData>({
        defaultValues: {
          expense: '',
          price: 0,
        },
        resolver: yupResolver(schemaAddExpense)
      });
      const onSubmit = (data: AddExpenseData) => {  
        console.log(productLabelAdd);
             //muszę zmodyfikować sposób dodawania wydatków aby przed dodaniem sprawdzić czy wydated o dodawanym id (u mnie productLabel) istnieje już w bazie, jeśli tak to do id dodać np. +1 bo teraz sprawdzamy tylko długość array w bazie i na tej podstawie id zwiększa się o +1
        addExpense(data, userId, idFormat, productLabelAdd);
      }
      const onEdit = (data: AddExpenseData) => {
        updateExpense(data, editExpense, productLabelUpdate).then((returnedData)=>{
            setEditExpens(returnedData[0].productCategory);
            setEditPrice(returnedData[0].productPrice);
        });
      }

    const expensesFilter = () => {
        return expenses.filter((exp:ExpensesData)=>{
            return (createPureMonthAndYearDataFormat(exp)).includes(idFormat);
        }).map((expens:ExpensesData)=>{   
            const splited = (expens.productLabel).split("-");                  
            return (
                <>
                        <div>{splited[2]}</div>
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

    useEffect(()=>{
        fetchDataByRow(userId).then((data)=>{
            setExpenses(expensesGetYear(data));
        });
    },[]);

    return (
        <>
            <h2>Details for {idFormat}</h2>
            <section className={style.expensesBox}>
                <div>
                    <h3>Add expense</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h3>Add expense category:</h3>
                        <InputField value={inputData.expenseData} />
                        <p>{errors.expense?.message}</p>
                        <h3>Add price:</h3>
                        <InputField value={inputData.priceData} />
                        <p>{errors.price?.message}</p>
                        <SubmitButton value={buttonData.addButton} />
                    </form>
                </div>
                <div>
                    <h3>Your expenses</h3>
                    <div>
                        <div className={style.container}>
                            <div>Id</div>
                            <div>Category</div>
                            <div>Price</div>
                            <div>Buttons</div>
                        </div>
                        <form onSubmit={handleSubmit(onEdit)} className={style.container}>{expensesFilter()}</form>
                    </div>
                </div>
            </section>
            <Link to={'/'}>
                <ConfirmButton value={buttonData.backButton} />
            </Link>
        </>
    )
}